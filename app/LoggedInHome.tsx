"use client"

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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  
import Link from "next/link"


interface TeacherProject {
    id: string;
    name: string;
    image: string;
  }
  

export default function LoggedInHome() {
    const teacherProjects: TeacherProject[] = [];
    
    // Call backend for projects
    for (let i = 1; i <= 3; i++) {
        const project: TeacherProject = {
          id: `project${i}`,
          name: `Project ${i}`,
          image: `https://example.com/project${i}.jpg`
        };
        teacherProjects.push(project);
    }


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

                         {/* Button for Creating New Class */}
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button> <PlusIcon className="h-4 w-4"/>Create New Class</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Class</DialogTitle>
                                    <DialogDescription>
                                        Create a new class here. You must provide a unique name for this class.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col space-y-8">
                                    <div className="flex flex-col space-y-4">
                                        <Label htmlFor="name">
                                            Class Display Name
                                        </Label>
                                        <Input id="name" value=""/>
                                    </div>

                                    <div className="flex flex-col space-y-4">
                                        <Label htmlFor="username">
                                            Unique Class Identifier
                                        </Label>
                                        <Input id="id" value=""/>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                         </Dialog>





                    </div>
                    <Card className="p-5">
                            <CardContent className="space-y-6 gray">
                                {/* Would be the individual class */}
                                {teacherProjects.map((item, i) => (
                                <div className="flex justify-between items-center hover:text-white">
                                    <Link href={`/teach/${item.id}`}>
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <Link href={`/teach/${item.id}`}>
                                        <button>{item.name}</button>
                                    </Link>
                                    <button><Cross1Icon/></button>
                                </div>
                                ))}
                            </CardContent>
                    </Card>
                </div>

                <div  className="w-1/2 mt-20">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-semibold text-2xl">Classes I'm Enrolled In</h1>
                        <Button> <PlusIcon className="h-4 w-4"/>Join New Class</Button>
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