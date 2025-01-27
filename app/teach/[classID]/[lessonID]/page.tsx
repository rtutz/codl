"use client"

import Lecture from "@/components/pages/views/teacher/lecture"
import MarkdownProvider from "@/providers/markdownProvider"
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SideNav from "@/components/common/sideNav";
import Coding from "@/components/pages/views/teacher/coding";
import QuizView from "@/components/pages/views/teacher/quiz";
import { useMarkdown } from "@/providers/markdownProvider"
import { LessonIdProvider, useLessonIdContext } from '../../../../components/lessons/lessonContext'
import { } from "../../../../components/lessons/lessonContext";
import { useSession } from "next-auth/react"
import { useClassRole } from "@/app/context/roleContext";
import StudentLecture from "@/components/pages/views/student/studentLecture";
import StudentCoding from "@/components/pages/views/student/studentCoding";
import StudentQuiz from "@/components/pages/views/student/studentQuiz";
import Header from "@/components/common/header";

interface Lesson {
    classId: number;
    dueDate: Date;
    id: string;
    lectureContent: string;
    name: string;
    published: boolean;
}

interface ICodingQuestion {
    id: string,
    lessonId: string,
    markdown: string,
    modified: boolean;
}

interface IQuizQuestion {
    id?: number;
    question: string;
    choices: { text: string; isCorrect: boolean, id: string }[];
    hint: string;
    modified: boolean
}


async function getLesson(lesson_id: string | undefined) {
    try {
        if (!lesson_id) {
            throw new Error('lesson_id is required');
        }

        const response = await fetch(`/api/lesson?lesson_id=${lesson_id}`, {
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

function LessonContent() {
    const [currentView, setCurrentView] = useState<string>('lesson');
    const params = useParams<{ classID: string; lessonID: string }>()!;
    const [classID, lessonID] = [params.classID, params.lessonID];
    const [lesson, setLesson] = useState<Lesson>();

    const { data: session, status, update } = useSession();
    const role = session?.user?.role as "TEACHER" | "STUDENT";
    // if (status !== "authenticated" || !role) redirect("/")

    const [lessonId, setLessonId] = useLessonIdContext();
    useEffect(() => {
        setLessonId(lessonID);
    }, [])

    // For Lecture
    const { markdown, setMarkdown } = useMarkdown();

    // For coding
    const [codingQuestions, setCodingQuestions] = useState<ICodingQuestion[]>([]);

    // For quiz
    const [quizQuestions, setQuizQuestions] = useState<IQuizQuestion[]>([]);


    useEffect(() => {
        async function fetchLesson() {
            if (lessonID) {
                const lessonData = await getLesson(lessonID);
                setLesson(lessonData);
                setMarkdown(lessonData?.lectureContent || '')

            }
        }

        async function getCodingQuestions() {
            try {
                const response = await fetch(`/api/question?lesson_id=${lessonID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                const data = await response.json();
                const modifiedData = data.map((item: ICodingQuestion) => ({ ...item, modified: false }));
                setCodingQuestions(modifiedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        async function getQuiz() {
            try {
                const response = await fetch(`/api/quiz?lesson_id=${lessonID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });
                const data = await response.json();
                setQuizQuestions(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchLesson();
        getCodingQuestions();
        getQuiz();
    }, [])

    function updateView(view: string) {
        setCurrentView(view);
    }

    const renderContent = () => {
        if (role === 'TEACHER') {
            switch (currentView) {
                case "lesson":
                    return (
                        <MarkdownProvider>
                            <Lecture
                                lectureContent={lesson?.lectureContent || ''}
                                lessonID={lessonID}
                                markdown={markdown}
                                setMarkdown={setMarkdown}
                            />
                        </MarkdownProvider>
                    );
                case "coding":
                    return (
                        <MarkdownProvider>
                            <Coding
                                lessonID={lessonID}
                                codingQuestions={codingQuestions}
                                setCodingQuestions={setCodingQuestions}
                            />
                        </MarkdownProvider>
                    );
                case "quiz":
                    return (
                        <QuizView
                            lessonID={lessonID}
                            quizQuestions={quizQuestions}
                            setQuizQuestions={setQuizQuestions}
                        />
                    );
                default:
                    return null;
            }
        } else if (role === 'STUDENT') {
            // Assuming 'STUDENT' role
            switch (currentView) {
                case "lesson":
                    return (
                        <StudentLecture
                            lessonMarkdown={markdown}
                        />
                    );
                case "coding":
                    return (
                        <StudentCoding
                            codingQuestions={codingQuestions}
                            setCodingQuestions={setCodingQuestions} />
                    );
                case "quiz":
                    return (
                        <StudentQuiz
                            lessonID={lessonID}
                            quizQuestions={quizQuestions}
                        />
                    );
                default:
                    return null;
            }
        }
    };



    return (
        <div className="flex flex-col h-screen">
            <Header updateCurrentView={updateView} />
            <div className="flex-1 overflow-hidden">
                {renderContent()}
            </div>
        </div>
    )
}

export default function LessonPage() {
    return (
        <LessonIdProvider>
            <MarkdownProvider>
                <LessonContent />
            </MarkdownProvider>
        </LessonIdProvider>
    );
}