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
            const userID: string = req.body.user_id;
            
            console.log("user id received: ", userID);
            
            const userClassData = await client.userClassMap.findMany({
                where: {
                    userID: userID
                }
            })
        
            const classData = await client.class.findMany();

            // This is just a SQL inner join since prisma does not support JOIN
            const joinedData = userClassData.map(userClass => {
                const matchingClass = classData.find(cls => cls.id === userClass.classID);
                return {
                  ...userClass,
                  className: matchingClass ? matchingClass.name : null,
                  ...matchingClass
                };
              });


            return res.status(200).json(joinedData)
    
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
      } else {
            res.status(405).json({ message: 'Method not allowed' });
      }
}

