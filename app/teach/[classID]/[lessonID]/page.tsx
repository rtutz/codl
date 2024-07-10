"use client"

import Lecture from "@/components/pages/lecture"
import MarkdownProvider from "@/providers/markdownProvider"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import Coding from "@/components/pages/coding";
import QuizView from "@/components/pages/quiz";
import { useMarkdown } from "@/providers/markdownProvider"
import { LessonIdProvider } from '../../../context/lessonContext'
import { useLessonIdContext } from "../../../context/lessonContext";
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
    markdown: string
}

interface IQuizQuestion {
    id: number;
    question: string;
    choices: { text: string; isCorrect: boolean }[];
    hint: string;
}


const quizData: IQuizQuestion[] = [
    {
        id: 1,
        question: "Which of the following are primary colors?",
        choices: [
            { text: "Red", isCorrect: true },
            { text: "Green", isCorrect: false },
            { text: "Blue", isCorrect: true },
            { text: "Yellow", isCorrect: true }
        ],
        hint: "Think about the colors you can't create by mixing other colors."
    },
    {
        id: 2,
        question: "Which planets in our solar system have rings?",
        choices: [
            { text: "Mars", isCorrect: false },
            { text: "Jupiter", isCorrect: true },
            { text: "Saturn", isCorrect: true },
            { text: "Uranus", isCorrect: true }
        ],
        hint: "Saturn is the most famous for its rings, but it's not alone."
    },
    {
        id: 3,
        question: "Which of these languages use a non-Latin script?",
        choices: [
            { text: "French", isCorrect: false },
            { text: "Russian", isCorrect: true },
            { text: "Arabic", isCorrect: true },
            { text: "Korean", isCorrect: true }
        ],
        hint: "Consider writing systems that look distinctly different from the English alphabet."
    }
];

async function getLesson(lesson_id: string | undefined) {
    try {
        if (!lesson_id) {
            throw new Error('lesson_id is required');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lesson?lesson_id=${lesson_id}`, {
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

    const [lessonId, setLessonId] = useLessonIdContext();
    setLessonId(lessonID);

    // For Lecture
    const { markdown, setMarkdown } = useMarkdown();

    // For coding
    const [codingQuestions, setCodingQuestions] = useState<ICodingQuestion[]>();

    // For quiz
    const [quizQuestions, setQuizQuestions] = useState<IQuizQuestion[]>(quizData);


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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/codingquestion?lesson_id=${lessonID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                const data = await response.json();
                setCodingQuestions(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        async function getQuiz() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz?lesson_id=${lessonID}`, {
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
    }, [])

    function updateView(view: string) {
        setCurrentView(view);
    }


    return (
        <div className="flex min-h-screen">
            {/* Side Nav */}
            <SideNav updateCurrentView={updateView} />

            <div className="flex-grow min-h-screen">

                {currentView === "lesson" &&
                    <MarkdownProvider>
                        <Lecture
                            lectureContent={lesson?.lectureContent || ''}
                            lessonID={lessonID}
                            markdown={markdown}
                            setMarkdown={setMarkdown}
                        />
                    </MarkdownProvider>
                }

                {currentView === "coding" &&
                    <MarkdownProvider>
                        <Coding
                            lessonID={lessonID}
                            codingQuestions={codingQuestions}
                            setCodingQuestions={setCodingQuestions}
                        />
                    </MarkdownProvider>
                }

                {currentView === "quiz" &&
                    <QuizView lessonID={lessonID} quizQuestions={quizQuestions} setQuizQuestions={setQuizQuestions!}/>
                }



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