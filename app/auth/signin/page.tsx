"use client"

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { FaGoogle } from 'react-icons/fa'

export default function SignIn() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl')

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <Card className="w-full max-w-md bg-slate-900 border-slate-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
                    <CardDescription className="text-slate-400">Sign in to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button 
                        className="w-full bg-emerald-700 hover:bg-emerald-600 text-white"
                        onClick={() => signIn('google', {callbackUrl: callbackUrl || "/"})}
                    >
                        <FaGoogle className="mr-2" />
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
