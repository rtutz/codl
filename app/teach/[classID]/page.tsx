"use client"
import { redirect, useParams } from "next/navigation"
import { useSession } from "next-auth/react"

function ClassHome() {
    const { data: session, status, update } = useSession()
    if (status !== "authenticated") redirect("/")

    // You have to do fetch here
    const classID = useParams<{classID: string}>()
    console.log(classID?.classID)
    return (
        <h1>test</h1>
    )
}

export default ClassHome;