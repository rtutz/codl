import { NextApiRequest, NextApiResponse } from "next";
import client from "@/prisma/client";

export const dynamic = "force-dynamic";

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method === 'GET') {
        try {
            const lessonID = req.query.lesson_id ? (req.query.lesson_id as string) : undefined;
            const classID = req.query.class_id ? (req.query.class_id as string) : undefined;
            const role = req.query.role ? (req.query.role as string) : 'STUDENT';

            if (lessonID) {
                const lessonsData = await client.lesson.findUnique({
                    where: {
                        id: lessonID
                    }
                })


                return res.status(200).json(lessonsData)
            }

            if (classID) {
                const whereClause = {
                    classId: classID,
                    ...(role === 'STUDENT' && { published: true })
                };

                const lessonsData = await client.lesson.findMany({ where: whereClause });

                return res.status(200).json(lessonsData);


            }



            return res.status(500).json("Invalid endpoint.");

        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else if (req.method === 'POST') {
        try {
            const name: string = req.body?.name;
            const classID: string = req.body?.classID;

            const response = await client.lesson.create({
                data: {
                    classId: classID,
                    name: name
                }
            })

            // The code below makes a codingQusetion entry automatically for when
            // 
            // const lessonId = response.id

            // if (response) {
            //     // Make an empty question associated to this lesson
            //     const createdQuestion = await client.codingQuestion.create({
            //         data: {
            //             lessonId: lessonId,
            //             markdown: ''
            //         }
            //     })
            // }

            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else if (req.method === 'PATCH') {
        try {
            const lessonID = Array.isArray(req.query.lesson_id) ? req.query.lesson_id[0] : req.query.lesson_id;
            const published_flag: boolean = req.body?.published_flag;

            const response = await client.lesson.update({
                where: {
                    id: lessonID
                },
                data: {
                    published: published_flag
                }
            })

            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else if (req.method === 'PUT') {
        try {
            const lessonID = Array.isArray(req.query.lesson_id) ? req.query.lesson_id[0] : req.query.lesson_id;
            const markdownData: string = req.body?.markdown;

            const response = await client.lesson.update({
                where: {
                    id: lessonID
                },
                data: {
                    lectureContent: markdownData
                }
            })

            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }

    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

