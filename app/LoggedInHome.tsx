'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent
} from "@/components/ui/card"
import SignOutBtn from "@/components/signOutBtn"
import type { DefaultSession } from 'next-auth';
import NewClassBtn from '@/components/newClassBtn';
import AlertUI from '@/components/error';
import DisplayClasses from '@/components/displayClasses';
import Link from "next/link";
import { useClassRole } from "@/app/context/roleContext"
import JoinClassBtn from '@/components/joinClassBtn';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

declare module 'next-auth' {
    interface Session {
        user: DefaultSession['user'] & {
            id: string;
            role: "TEACHER" | "STUDENT"
        };
    }
}

interface RawClassData {
    userID: string;
    classID: number;
    role: 'TEACHER' | 'STUDENT';
    className: string;
    id: string;
    name: string;
}

interface ClassData {
    id: string;
    name: string;
}


async function getClasses(user_id: string) {
    try {
        const response = await fetch(`/api/class?user_id=${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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


export default function LoggedInHome() {
    const { data: session, status } = useSession();
    const { setRole, setUserId } = useClassRole();
    const router = useRouter();
    const [teacherClasses, setTeacherClasses] = useState<ClassData[]>([]);
    const [newClassName, setNewClassName] = useState<string>('');
    const [classID, setClassID] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);

    useEffect(() => {
        if (status === 'authenticated') {
            setRole(session.user.role);
            setUserId(session.user.id);
        }
    }, [status])

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                const classesData: RawClassData[] = await getClasses(session?.user?.id);
                const teacherClasses = classesData?.map(({ id, name }) => ({ id, name })) ?? [];

                setTeacherClasses(teacherClasses);
            } else {
                router.push('/');
            }
        };

        fetchData();
    }, [session, router]);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        if (showAlert) {
            timeout = setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        }
        return () => clearTimeout(timeout);
    }, [showAlert]);

    async function submitNewClass() {
        const response = await fetch(`/api/class`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newClassName, userID: session?.user?.id }),
            cache: 'no-store',
        });

        const responseData = await response.json();
        setNewClassName('');
        setTeacherClasses([...teacherClasses, responseData]);
    }

    async function submitJoinClass() {
        const response = await fetch(`/api/class`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID: session?.user?.id, classID: classID }),
            cache: 'no-store',
        });

        if (!response.ok) {
            setShowAlert(true);
            return;
        } else {
            const responseData = await response.json();
            setClassID('');
            router.push(`teach/${responseData.id}`)
        }
    }


    function updateDisplayedClasses(classID: string) {
        setTeacherClasses((prevTeacherClasses) =>
            prevTeacherClasses.filter((cls) => cls.id !== classID)
        );
    }

    const handleRoleSwitch = () => {
        // Implement the logic to switch the user's role to teacher
        // This should include API calls and state updates
        console.log("Switching to teacher role");
    };

    // const handleClassClick = (classID: string, role: string) => {
    //     setClassID(classID);
    //     setUserId(session?.user?.id);
    // };

    if (!session) {
        return null; // or render a loading state
    }

    return (
        <div className="min-h-screen">
            {showAlert && <AlertUI message="The given class ID does not exist or you are already teaching this class." styling="destructive" />}

            {/* Header with profile dropdown */}
            <header className=" shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-boldx">Dashboard</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="h-10 w-10 cursor-pointer">
                                <AvatarImage src={session.user.image || "https://github.com/shadcn.png"} alt={session.user.name || ""} />
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {session.user.role === 'STUDENT' && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            Switch to Teacher
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. Switching to a teacher role will delete all your current classes.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleRoleSwitch}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                            <DropdownMenuItem onSelect={() =>signOut()}>Sign out</DropdownMenuItem>
                        </DropdownMenuContent>

                    </DropdownMenu>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className=" shadow-sm rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Your Classes</h2>
                        {session.user.role === 'TEACHER' ? (
                            <NewClassBtn newClassName={newClassName} setNewClassName={setNewClassName} submitNewClass={submitNewClass} />
                        ) : (
                            <JoinClassBtn classID={classID} setClassID={setClassID} submitJoinClass={submitJoinClass} />
                        )}
                    </div>
                    <Card className="">
                        <CardContent className="p-4 space-y-4">
                            {teacherClasses.map((item, i) => (
                                <Link href={`/teach/${item.id}`} key={`teacher-${i}`}>
                                    <DisplayClasses
                                        classID={item.id}
                                        name={item.name}
                                        deleteEntireClass={true}
                                        userID={session?.user?.id}
                                        updateDisplayedClasses={updateDisplayedClasses}
                                    />
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}