import { NextApiRequest, NextApiResponse } from "next";

export const dynamic = "force-dynamic";

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const lessonID = req.query.lesson_id ? (req.query.lesson_id as string) : undefined;

        if (lessonID) {
            // const quizData = 
        }

    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}