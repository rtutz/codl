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
            const userID: string = req.body?.userID;
            const role = req.body?.role;
            const classID = req.body?.classID || nanoid(5);

            const returnValue = {
                id: classID,
                name: name
            }

            if (role === 'TEACHER') {
                const data = await client.class.create({
                    data: returnValue
                })
            }

            const updatedUserClassMap = await client.userClassMap.create({
                data: {
                    userID: userID,
                    classID: classID,
                    role: role,
                }
            })
            res.status(200).json(returnValue);

        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else if (req.method === 'DELETE') {
        try {

            const classID: string = req.body?.classID;
            const deleteEntireClass: boolean = req.body?.deleteEntireClass;
            const userID = req.body?.userID;

            // either we delete the entire class on Class Table or just the association
            // of a student to a class.
            if (deleteEntireClass) {
                await client.class.delete({
                    where: {
                        id: classID
                    }
                })

                return res.status(200).json(`Successfully deleted class with ID ${classID}`);

            } else {
                await client.userClassMap.delete({
                    where: {
                        userID_classID: {
                            userID: userID,
                            classID: classID
                        }
                    }
                })

                return res.status(200).json(`Successfully deleted class with ID ${classID} from user ${userID}'s current classes`);
            }

            

        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    } else if (req.method === 'GET') {
        try {
            const userID = req.query.user_id ? (req.query.user_id as string) : undefined;
            const classID = req.query.class_id ? (req.query.class_id as string) : undefined;
      
            if (userID) {
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
            }

            if (classID) {
                const classData = await client.class.findUnique({
                    where: {
                        id: classID
                    }
                })

                return res.status(200).json(classData);
            }

            res.status(500).json("Invalid endpoint for class.");
          } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' });
          }
    }


    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

