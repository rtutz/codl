"use client"

import Lecture from "@/components/lecture"
import MarkdownProvider from "@/providers/markdownProvider"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import Coding from "@/components/coding";

interface Lesson {
    classId: number;
    dueDate: Date;
    id: string;
    lectureContent: string;
    name: string;
    published: boolean;
  }

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

export default function lesson() {
    const [currentView, setCurrentView] = useState<string>('lesson');
    const params = useParams<{ classID: string; lessonID: string }>()!;
    const [classID, lessonID] = [params.classID, params.lessonID];
    const [lesson, setLesson] = useState<Lesson>();

    useEffect(() => {
        async function fetchLesson() {
            if (lessonID) {
                const lessonData = await getLesson(lessonID);
                setLesson(lessonData);
            }
        }

        fetchLesson();
    }, [])

    function updateView(view: string) {
        console.log("view is now", view);
        setCurrentView(view);
    }


    return (
        <div className="flex min-h-screen">
            {/* Side Nav */}
            <SideNav updateCurrentView={updateView}/>
            
            <div className="flex-grow min-h-screen">
                {currentView === "lesson" &&
                    <MarkdownProvider>
                        <Lecture lectureContent={lesson?.lectureContent || ''} lessonID={lessonID}/>
                    </MarkdownProvider>
                }

                {currentView === "coding" && <Coding lessonID={lessonID}/>}


            </div>
            
        </div>
    )
}