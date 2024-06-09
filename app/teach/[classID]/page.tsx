"use client"
import { redirect, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, Pencil1Icon, PersonIcon, PlusIcon } from "@radix-ui/react-icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

async function getLessons(class_id: string | undefined) {
    try {
        if (!class_id) {
            throw new Error('class_id is required');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lesson?class_id=${class_id}`, {
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

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/class?class_id=${class_id}`, {
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


    if (status !== "authenticated") redirect("/")

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
                const lessonsData = await getLessons(classID?.classID);
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

    const switchPublish = (id: string, checked: boolean) => {
        const updatedLessons = lessons.map((lesson) =>
            lesson.id === id ? { ...lesson, published: checked } : lesson
        );
        setLessons(updatedLessons);

        // Add logic to update the database 
    };

    return (
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
                        <button>
                            <Pencil1Icon />
                        </button>

                    </div>

                </div>

                {/* Manage Team Members */}
                <button className="flex items-center space-x-4 text-xs gray max-w-fit">
                    <PersonIcon /> <span>Manage Class Members</span>
                </button>

                {/* Create new Project */}
                <Button className="max-w-fit mt-10">
                    <PlusIcon /><span className="mx-4">Create New Lesson</span>
                </Button>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Title</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Submissions</TableHead>
                                <TableHead className="text-right">Published</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lessons.map((lesson) => (
                                <TableRow key={lesson.id} onClick={(e) => openProject(e, lesson.id)}>
                                    <TableCell className="font-medium">{lesson.name}</TableCell>
                                    <TableCell>{formatDate(lesson.dueDate)}</TableCell>
                                    <TableCell>5/4</TableCell>
                                    <TableCell className="text-right">
                                        <Switch checked={lesson.published}
                                            onCheckedChange={(checked) => {
                                                switchPublish(lesson.id, checked);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </Card>
            </div>



            {/* Who's Coding? */}
        </div>
    )
}

export default ClassHome;