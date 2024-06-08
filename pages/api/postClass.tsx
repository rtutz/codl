import { nanoid } from 'nanoid'

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

            const name: string = req.body?.name;
            const id = nanoid(5);

            const data = await client.class.create({
                data: {
                    id: id,
                    name: name
                }
            })
            res.status(200).json(data);
    
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
      } else {
            res.status(405).json({ message: 'Method not allowed' });
      }
}

