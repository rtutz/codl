"use client"

import Lecture from "@/components/lecture"
import MarkdownProvider from "@/providers/markdownProvider"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getLesson`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lesson_id }),
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


    return (
        <div className="flex min-h-screen">
            {/* Side Nav */}
            <div className="border border-border min-h-full" style={{width: '6%'}}>
                testing
            </div>
            
            <div className="flex-grow min-h-screen">
                <MarkdownProvider>
                <Lecture lectureContent={lesson?.lectureContent || ''} />

                </MarkdownProvider>
            </div>
            
        </div>
    )
}