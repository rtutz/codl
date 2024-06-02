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
            const userID: string = req.body;
            
            console.log("user id received: ", userID);

            const data = await client.userLessonMap.findMany({
                where: {
                    userID: userID
                }
            })
            return res.status(200).json(data)
    
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
      } else {
            res.status(405).json({ message: 'Method not allowed' });
      }
}

