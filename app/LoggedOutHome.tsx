import Login from "./auth/Login";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoggedOutHome() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Welcome to Codl</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center mb-6 text-gray-600">Please log in to continue</p>
                    <Login />
                </CardContent>
            </Card>
        </div>
    )
}