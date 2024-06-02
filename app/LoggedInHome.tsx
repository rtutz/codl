import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent
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

import { getServerSession } from "next-auth"
import { authOptions } from "../pages/api/auth/[...nextauth].js"
import { redirect } from "next/navigation"
import SignOutBtn from "@/components/signOutBtn"

interface TeacherProject {
    id: string;
    name: string;
    image: string;
}

interface ClassData {
    userID: string;
    classID: number;
    role: 'TEACHER' | 'STUDENT';
    className: string;
    id: number;
    name: string;
  }
  

async function getClasses(user_id: string) {
    try {
        const response = await fetch(`${process.env.LOCAL_PATH}/api/getClasses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id }),
          cache: 'no-store',
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
    
        return response.json();
      } catch (error) {
        console.error('Error:', error);
      }
}


export default async function LoggedInHome() {
    const session = await getServerSession(authOptions);
    
    let user_id = ''
    
    if (session) {
        user_id = session.user.id
    } else {
        redirect('/');
    }

    const classesData: ClassData[] = await getClasses(user_id);

    const teacherClasses: ClassData[] = classesData.filter((item) => item.role === 'TEACHER');
    const studentClasses: ClassData[] = classesData.filter((item) => item.role === 'STUDENT');

    return (
        <div>
            {/* Back button */}
            <SignOutBtn/>



            {/* Div for center materials */}
            <div className="flex flex-col items-center min-h-screen mt-10 w-full">

                <div className="w-1/2">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-semibold text-2xl">Classes I'm Teaching</h1>

                        {/* Button for Creating New Class */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button> <PlusIcon className="h-4 w-4" />Create New Class</Button>
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
                                        <Input id="name" value="" />
                                    </div>

                                    <div className="flex flex-col space-y-4">
                                        <Label htmlFor="username">
                                            Unique Class Identifier
                                        </Label>
                                        <Input id="id" value="" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </div>
                    <Card className="p-5">
                        <CardContent className="gray p-0 space-y-6">
                            {/* Would be the individual class */}
                            {teacherClasses.map((item, i) => (
                                <div className="flex justify-between items-center hover:text-white" key={i}>
                                    <Link href={`/teach/${item.id}`}>
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <Link href={`/teach/${item.id}`}>
                                        <button>{item.name}</button>
                                    </Link>
                                    <button><Cross1Icon /></button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="w-1/2 mt-20">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-semibold text-2xl">Classes I'm Enrolled In</h1>
                        <Button> <PlusIcon className="h-4 w-4" />Join New Class</Button>
                    </div>
                    <Card className="p-5">
                        <CardContent className="space-y-6 gray">
                            {/* Would be the individual class */}
                            {studentClasses.map((item, i) => (
                                <div className="flex justify-between items-center hover:text-white" key={i}>
                                    <Link href={`/teach/${item.id}`}>
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <Link href={`/teach/${item.id}`}>
                                        <button>{item.name}</button>
                                    </Link>
                                    <button><Cross1Icon /></button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    )
}