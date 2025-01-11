"use client"
import { redirect, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, Pencil1Icon, PersonIcon } from "@radix-ui/react-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Loader from "@/components/ui/loader"
import { useClassRole } from "@/app/context/roleContext";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { MouseEvent, useEffect, useState } from "react"
import { usePathname } from 'next/navigation'
import NewLessonBtn from "@/components/lessons/newLessonBtn"
import { ContextMenu } from "@/components/ui/context-menu"

interface Lesson {
    classId: number;
    dueDate: Date;
    id: string;
    lectureContent: string;
    name: string;
    published: boolean;
}

interface Class {
    id: string,
    name: string
}

async function getLessons(class_id: string | undefined, role: string | undefined) {
    try {
        if (!class_id) {
            throw new Error('class_id is required');
        }

        const response = await fetch(`/api/lesson?class_id=${class_id}&role=${role}`, {
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
        return null;
    }
}

async function getClassInfo(class_id: string | undefined) {
    try {
        if (!class_id) {
            throw new Error('class_id is required');
        }

        const response = await fetch(`/api/class?class_id=${class_id}`, {
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
        return null;
    }
}

function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}


function ClassHome() {
    const { data: session, status, update } = useSession();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [classInfo, setClassInfo] = useState<Class>();
    const [newLessonName, setNewLessonName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const role = session?.user?.role as "TEACHER" | "STUDENT";
    // if (status !== "authenticated" || !role) redirect("/")

    const router = useRouter();
    const pathname = usePathname();

    const openProject = (e: MouseEvent, lessonId: string) => {
        e.preventDefault();
        router.push(`${pathname}/${lessonId}`);
    }

    const classID = useParams<{ classID: string }>();

    useEffect(() => {
        const fetchData = async () => {
            if (classID) {
                const lessonsData = await getLessons(classID?.classID, role);
                console.log("lessonsData is", lessonsData);
                const transformedData: Lesson[] = lessonsData.map((lesson: any) => ({
                    ...lesson,
                    dueDate: new Date(lesson.dueDate), // Transform dueDate to a Date object
                }));

                const classInfoData = await getClassInfo(classID?.classID);
                setClassInfo(classInfoData);

                setLessons(transformedData);
            }

        };

        fetchData();

    }, [])

    async function submitNewLesson() {
        // setLoading(true); 
        console.log("Submitting new lesson")

        try {
            const response = await fetch(`/api/lesson`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newLessonName, classID: classID?.classID }),
                cache: 'no-store',
            });

            const responseData = await response.json();
            setNewLessonName('');
            setLessons([...lessons, responseData]);
        } catch (error) {
            console.error('Error submitting lesson:', error);
        }
        // finally {
        //     setLoading(false); 
        // }
    }

    const switchPublish = async (id: string, checked: boolean) => {
        const updatedLessons = lessons.map((lesson) =>
            lesson.id === id ? { ...lesson, published: checked } : lesson
        );

        const responseDB = await fetch(`/api/lesson?lesson_id=${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ published_flag: checked }),
            cache: 'no-store',
        });

        if (!responseDB.ok) {
            redirect('/')
        }

        setLessons(updatedLessons);

        // Add logic to update the database 
    };

    return (
        <>
            {loading && (
                <div className="loading-screen">
                    <Loader /> {/* Display the loader while loading */}
                    <p>Loading...</p>
                </div>
            )}

            <div>
                <button className="flex items-center justify-start top-0 left-0 m-10" onClick={() => router.push('/')}>
                    <ChevronLeftIcon className="h-4 w-4" color="#ADADAD" />
                    <span className="gray text-sm">Back to all classes</span>

                </button>
                {/* header */}
                <div className="flex flex-col w-3/4 mx-auto">
                    <div className="m-10 w-full flex justify-between items-center flex-shrink-0 mx-auto">
                        <div className="w-full h-full flex items-center">
                            <Avatar className="h-1/6 w-1/6 mr-10">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-start">
                                <h1 className="text-3xl">{classInfo?.name}</h1>
                                <span className="text-xs">{classInfo?.id}</span>
                            </div>
                        </div>
                        <div>
                            {/* {role === 'TEACHER' && <button>
                            <Pencil1Icon />
                        </button>} */}

                        </div>

                    </div>

                    {/* Manage Team Members */}
                    {/* {role === 'TEACHER' && <button className="flex items-center space-x-4 text-xs gray max-w-fit">
                    <PersonIcon /> <span>Manage Class Members</span>
                </button>} */}

                    {/* Create new Project */}
                    {role === 'TEACHER' && <NewLessonBtn newLessonName={newLessonName} setNewLessonName={setNewLessonName} submitNewLesson={submitNewLesson} />}
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Title</TableHead>
                                    {role === 'TEACHER' && <TableHead className="text-right">Published</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lessons.map((lesson) => (
                                    
                                    <TableRow key={lesson.id} onClick={(e) => openProject(e, lesson.id)}>
                                        <TableCell className="font-medium">{lesson.name}</TableCell>
                                        {role === 'TEACHER' &&
                                            <TableCell className="text-right">
                                                <Switch checked={lesson.published}
                                                    onCheckedChange={(checked) => {
                                                        switchPublish(lesson.id, checked);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </TableCell>}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>



                {/* Who's Coding? */}
            </div>
        </>
    )
}

export default ClassHome;