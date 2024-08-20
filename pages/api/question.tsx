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
    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        case 'PATCH':
            return handlePatch(req, res);
        case 'POST':
            return handlePost(req, res);
        case 'DELETE':
            return handleDelete(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        const lessonId = req.query.lesson_id as string | undefined;
        const userId = req.query.userId as string;
        const questionId = req.query.questionId as string;

        if (lessonId) {
            const response = await client.codingQuestion.findMany({
                where: { lessonId },
                orderBy: { id: 'asc' }
            });
            return res.status(200).json(response);
        } else if (userId && questionId) {
            let response = await client.userCodingMap.findUnique({
                where: {
                    userId_codingQuestionId: { userId, codingQuestionId: questionId },
                },
            });

            if (!response) {
                response = await client.userCodingMap.create({
                    data: { userId, codingQuestionId: questionId, value: '' }
                });
            }
            return res.status(200).json(response);
        } else {
            return res.status(400).json({ message: 'Missing required parameters' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

async function handlePatch(req: NextApiRequest, res: NextApiResponse) {
    try {
        const codingQuestionId = req.query.id as string | undefined;
        const { userId, questionId, value, markdown } = req.body;

        if (codingQuestionId && markdown !== undefined) {
            const response = await client.codingQuestion.update({
                where: { id: codingQuestionId },
                data: { markdown }
            });
            return res.status(200).json(response);
        } else if (userId && questionId && value !== undefined) {
            const response = await client.userCodingMap.update({
                where: {
                    userId_codingQuestionId: { userId, codingQuestionId: questionId },
                },
                data: { value }
            });
            return res.status(200).json(response);
        } else {
            return res.status(400).json({ message: 'Missing required parameters' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { lessonId } = req.body;

        if (!lessonId) {
            return res.status(400).json({ message: 'Missing lessonId' });
        }

        const response = await client.codingQuestion.create({
            data: { lessonId, markdown: '' }
        });
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    try {
        const codingQuestionId = req.query.id as string | undefined;

        if (!codingQuestionId) {
            return res.status(400).json({ message: 'Missing id parameter' });
        }

        const response = await client.codingQuestion.delete({
            where: { id: codingQuestionId }
        });
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}