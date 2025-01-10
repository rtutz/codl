"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface LoginProps {
    className?: string;
}

export default function Login({ className }: LoginProps) {
    return (
        <Button
            onClick={() => signIn()}
            variant="outline"
            className={className}
        >
            Sign in
        </Button>
    );
}