"use client"

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function SignOutBtn() {
    return (
        <div className="top-0 left-0 m-10">
            <Button onClick={() => signOut()}>
                <ChevronLeftIcon className="h-4 w-4" />
                Logout
            </Button>
        </div>
    )
}