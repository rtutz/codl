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

    if (req.method === 'POST') {
        try {
            const lessonID: string = req.body.lesson_id;
                        
            const lessonsData = await client.lesson.findUnique({
                where: {
                    id: lessonID
                }
            })
    

            return res.status(200).json(lessonsData)
    
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
      } else {
            res.status(405).json({ message: 'Method not allowed' });
      }
}

