'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent
} from "@/components/ui/card"
import SignOutBtn from "@/components/signOutBtn"
import type { DefaultSession } from 'next-auth';
import NewClassBtn from '@/components/newClassBtn';
import JoinClassBtn from '@/components/joinClassBtn';
import AlertUI from '@/components/error';
import DisplayClasses from '@/components/displayClasses';

declare module 'next-auth' {
    interface Session {
        user: DefaultSession['user'] & {
            id: string;
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/class?user_id=${user_id}`, {
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
    const { data: session } = useSession();
    const router = useRouter();
    const [teacherClasses, setTeacherClasses] = useState<ClassData[]>([]);
    const [studentClasses, setStudentClasses] = useState<ClassData[]>([]);
    const [newClassName, setNewClassName] = useState<string>('');
    const [classID, setClassID] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                const classesData: RawClassData[] = await getClasses(session?.user?.id);
                const teacherClasses = classesData
                    .filter((item) => item.role === 'TEACHER')
                    .map(({ id, name }) => ({ id, name }));

                const studentClasses = classesData
                    .filter((item) => item.role === 'STUDENT')
                    .map(({ id, name }) => ({ id, name }));
                setTeacherClasses(teacherClasses);
                setStudentClasses(studentClasses);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/class`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newClassName, userID: session?.user?.id, role: 'TEACHER' }),
            cache: 'no-store',
        });

        const responseData = await response.json();
        setNewClassName('');
        setTeacherClasses([...teacherClasses, responseData]);
    }

    async function submitJoinClass() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/class`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID: session?.user?.id, role: 'STUDENT', classID: classID }),
            cache: 'no-store',
        });

        if (!response.ok) {
            setShowAlert(true);
            return;
        } else {
            const responseData = await response.json();
            setClassID('');
            setStudentClasses([...studentClasses, responseData]);
        }
    }

    function updateDisplayedClasses(classID: string) {
        setTeacherClasses((prevTeacherClasses) =>
            prevTeacherClasses.filter((cls) => cls.id !== classID)
        );

        setStudentClasses((prevStudentClasses) =>
            prevStudentClasses.filter((cls) => cls.id !== classID)
        );
    }

    if (!session) {
        return null; // or render a loading state
    }

    return (
        <div>
            {showAlert && <AlertUI message={"The given class ID do not exist or you are already teaching this class."} />}

            {/* Back button */}
            <SignOutBtn />



            {/* Div for center materials */}
            <div className="flex flex-col items-center min-h-screen mt-10 w-full">

                <div className="w-1/2">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-semibold text-2xl">Classes I'm Teaching</h1>

                        <NewClassBtn newClassName={newClassName} setNewClassName={setNewClassName} submitNewClass={submitNewClass} />


                    </div>
                    <Card className="p-5">
                        <CardContent className="gray p-0 space-y-6">
                            {/* Would be the individual class */}
                            {teacherClasses.map((item, i) => (
                                <DisplayClasses
                                    classID={item.id} name={item.name}
                                    deleteEntireClass={true}
                                    userID={session?.user?.id}
                                    updateDisplayedClasses={updateDisplayedClasses} />
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="w-1/2 mt-20">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-semibold text-2xl">Classes I'm Enrolled In</h1>
                        <JoinClassBtn classID={classID} setClassID={setClassID} submitJoinClass={submitJoinClass} />
                    </div>
                    <Card className="p-5">
                        <CardContent className="space-y-6 gray">
                            {/* Would be the individual class */}
                            {studentClasses.map((item, i) => (
                                <DisplayClasses classID={item.id} name={item.name}
                                    deleteEntireClass={false}
                                    userID={session?.user?.id}
                                    updateDisplayedClasses={updateDisplayedClasses} />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    )
}