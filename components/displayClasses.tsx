"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Cross1Icon } from "@radix-ui/react-icons"
import { useState } from "react"
import AlertUI from "./error"

interface IClass {
    classID: string,
    name: string,
    deleteEntireClass: boolean
    userID: string,
    updateDisplayedClasses: (classID: string) => void;
}

export default function DisplayClasses({ classID, name, deleteEntireClass, userID, updateDisplayedClasses }: IClass) {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    { showAlert && <AlertUI message={"The given class ID do not exist or you are already teaching this class."} /> }

    async function deleteClass() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/class`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ classID, deleteEntireClass, userID }),
            cache: 'no-store',
        })

        if (!response.ok) {
            setShowAlert(true);
            return;
        } else {
            const responseData = await response.json();
            console.log(responseData);
            updateDisplayedClasses(classID);
        }

    }


    return (
        <>
            {showAlert && <AlertUI message={"There was an error deleting this project."} />}
            <div className="flex justify-between items-center hover:text-white" key={classID}>
                <Link href={`/teach/${classID}`}>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Link>
                <Link href={`/teach/${classID}`}>
                    <button>{name}</button>
                </Link>
                <button onClick={deleteClass}>
                    <Cross1Icon />
                </button>
            </div>
        </>
    )
}