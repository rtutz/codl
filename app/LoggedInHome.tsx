import { ChevronLeftIcon, Cross1Icon, PlusIcon } from "@radix-ui/react-icons"

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
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-semibold text-2xl">Classes I'm Teaching</h1>
                        <Button> <PlusIcon className="h-4 w-4"/>Create New Class</Button>
                    </div>
                    <Card className="p-5">
                            <CardContent className="space-y-6 gray">
                                {/* Would be the individual class */}
                                {[...Array(5)].map((_, i) => (
                                <div className="flex justify-between items-center hover:text-white">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <h1>Intro to Python</h1>
                                    <Cross1Icon/>
                                </div>
                                ))}
                            </CardContent>
                    </Card>
                </div>

                <div  className="w-1/2 mt-20">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-semibold text-2xl">Classes I'm Enrolled In</h1>
                        <Button> <PlusIcon className="h-4 w-4"/>Create New Class</Button>
                    </div>
                    <Card className="p-5">
                            <CardContent className="space-y-6 gray">
                                {/* Would be the individual class */}
                                {[...Array(5)].map((_, i) => (
                                <div className="flex justify-between items-center hover:text-white">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <h1>Intro to Python</h1>
                                    <Cross1Icon/>
                                </div>
                                ))}
                            </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    )
}