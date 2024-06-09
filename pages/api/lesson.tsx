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
            
            if (lessonID) {
                const lessonsData = await client.lesson.findUnique({
                    where: {
                        id: lessonID
                    }
                })
        
    
                return res.status(200).json(lessonsData)
            }

            if (classID) {
                const lessonsData = await client.lesson.findMany({
                    where: {
                        classId: classID
                    }
                })
                return res.status(200).json(lessonsData)

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
            
            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }       
      }
      
      else {
            res.status(405).json({ message: 'Method not allowed' });
      }
}

