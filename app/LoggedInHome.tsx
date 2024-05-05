import { ChevronLeftIcon } from "@radix-ui/react-icons"
import { Cross1Icon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function LoggedInHome() {
    return (
        <div>
            {/* Back button */}
            <div className="top-0 left-0 m-10">
                <Button>
                    <ChevronLeftIcon className="h-4 w-4" />
                    Logout
                </Button>
            </div>

            {/* Div for center materials */}
            <div className="flex flex-col items-center min-h-screen mt-10  w-full">

                <div  className="w-1/2">
                    <div className="flex justify-between items-center">
                        <h1 className="">Classes I'm Teaching</h1>
                        <Button>Create New Class</Button>
                    </div>
                    <Card className="p-5">
                        <CardContent className="space-y-6 gray">
                            {/* Would be the individual class */}
                            <div className="flex justify-between items-center hover:text-white">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1>Intro to Python</h1>
                                <Cross1Icon/>
                            </div>
                            <div className="flex justify-between items-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1>Intro to Python</h1>
                                <Cross1Icon/>
                            </div>
                            <div className="flex justify-between items-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1>Intro to Python</h1>
                                <Cross1Icon/>
                            </div>  
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    )
}