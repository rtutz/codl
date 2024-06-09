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
            
            if (lessonID) {
                const response = await client.codingQuestion.findMany({
                    where: {
                        lessonId: lessonID
                    }
                })


                return res.status(200).json(response)
            }

            return res.status(500).json("Invalid endpoint.");

        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

