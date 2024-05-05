"use client"
import { redirect, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { ChevronLeftIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


function ClassHome() {
    const { data: session, status, update } = useSession()
    if (status !== "authenticated") redirect("/")

    // You have to do fetch here
    const classID = useParams<{classID: string}>()
    console.log(classID?.classID)
    return (
        <div>
            <div className="flex items-center justify-start top-0 left-0 m-10">
                
                <ChevronLeftIcon className="h-4 w-4" color="#ADADAD"/>
                <span className="gray text-sm">Back to all classes</span>
            </div>
            {/* header */}
            <div className="m-10 w-3/4 flex justify-between items-center flex-shrink-0 mx-auto">
                <div className="w-full h-full flex items-center">
                    <Avatar className="h-1/6 w-1/6 mr-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start">
                    <h1 className="text-3xl">Intro to Python</h1>
                        <span className="text-xs">6473338512</span>
                    </div>
                </div>
                <div>
                    <Pencil1Icon/>
                </div>

            </div>

            {/* Manage Team Members */}

            {/* Button */}
            <div></div>

            {/* Who's Coding? */}
        </div>
    )
}

export default ClassHome;