"use client"
import { useParams } from "next/navigation"

export default function ClassHome() {
    // You have to do fetch here
    const classID = useParams<{classID: string}>()
    console.log(classID?.classID)
    return (
        <h1>test</h1>
    )
}