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
            const codingquestionID = req.query.id ? (req.query.id as string) : undefined;

            if (codingquestionID) {
                const response = await client.testCases.findMany({
                    where: {
                        codingQuestionId: codingquestionID
                    }
                })


                return res.status(200).json(response)
            }

            return res.status(500).json("Invalid endpoint.");

        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else if (req.method === 'POST') {
        try {
            const { input, output, codingQuestionId } = req.body;
            const newTestCase = await client.testCases.create({
                data: {
                    input,
                    output,
                    codingQuestionId,
                },
            });
            return res.status(201).json(newTestCase);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else if (req.method === 'PUT') {
        try {
            const { id, input, output } = req.body;
            const updatedTestCase = await client.testCases.update({
                where: { id },
                data: { input, output },
            });
            return res.status(200).json(updatedTestCase);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

