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

            console.log(role, classID);

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
    }


    else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

