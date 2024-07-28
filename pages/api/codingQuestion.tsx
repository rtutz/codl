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

            const userId = req.query.userId as string;
            const questionId = req.query.questionId as string;

            if (lessonID) {
                const response = await client.codingQuestion.findMany({
                    where: {
                        lessonId: lessonID
                    },
                    orderBy: {
                        id: 'asc'
                    }
                })

                if (!response) {
                    return res.status(404).json({ error: 'Data not found' });
                }

                return res.status(200).json(response)
            } else if (userId && questionId) {
                let response = await client.userCodingMap.findUnique({
                    where: {
                        userId_codingQuestionId: {
                            userId: userId,
                            codingQuestionId: questionId,
                        },
                    },
                });



                if (!response) {
                    // Create a new entry if it doesn't exist
                    response = await client.userCodingMap.create({
                        data: {
                            userId: userId,
                            codingQuestionId: questionId,
                            value: '' // Initialize with an empty string
                        }
                    });
                }
                return res.status(200).json(response);
            }

            return res.status(500).json("Invalid endpoint.");

        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else if (req.method === 'PATCH') {
        try {
            const codingquestionID = req.query.id ? (req.query.id as string) : undefined;
            const markdownData = req.body?.markdown;

            const { userId, questionId, value } = req.body as { userId: string; questionId: string; value: string };

            if (codingquestionID) {
                const response = await client.codingQuestion.update({
                    where: {
                        id: codingquestionID
                    },
                    data: {
                        markdown: markdownData
                    }
                })

                return res.status(200).json(response)
            } if (userId && questionId && value) {
                const response = await client.userCodingMap.update({
                    where: {
                        userId_codingQuestionId: {
                            userId: userId,
                            codingQuestionId: questionId,
                        },
                    },
                    data: {
                        value: value
                    }
                });
    
                return res.status(200).json(response);
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else if (req.method === 'POST') {
        try {
            const lessonID = req.body?.lessonId;

            if (lessonID) {
                const response = await client.codingQuestion.create({
                    data: {
                        lessonId: lessonID,
                        markdown: ''
                    }
                })

                return res.status(200).json(response)
            }


        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else if (req.method === 'DELETE') {
        const codingquestionID = req.query.id ? (req.query.id as string) : undefined;

        if (codingquestionID) {
            const response = await client.codingQuestion.delete({
                where: {
                    id: codingquestionID
                }
            })
            return res.status(200).json(response)
        }
    }

    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

