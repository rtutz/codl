"use client"
import { useMarkdown } from "@/providers/markdownProvider"
import { useLessonIdContext } from "@/app/context/lessonContext"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import AlertUI from "../error";
import MarkdownPreview from "../markdownPreview";
import MarkdownEditor from "../markdownEditor";

interface ILecture {
    lectureContent: string;
    lessonID: string;
    markdown: string;
    setMarkdown: React.Dispatch<React.SetStateAction<string>>;
}
export default function Lecture({ lectureContent, lessonID, markdown, setMarkdown }: ILecture) {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('There was an error saving the file.');
    const [alertStyling, setAlertStyling] = useState<"default" | "destructive" | null | undefined>('destructive');

    const [lessonId, setLessonId] = useLessonIdContext();
    console.log("LessonId that is seen in lecture.tsx is ", lessonId)


    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        if (showAlert) {
            timeout = setTimeout(() => {
                setShowAlert(false);
                setAlertMessage('There was an error saving the file.');
                setAlertStyling('destructive')
            }, 5000);
        }
        return () => clearTimeout(timeout);
    }, [showAlert]);

    async function saveMarkdown() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lesson?lesson_id=${lessonID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ markdown: markdown }),
            cache: 'no-store',
        });

        if (!response.ok) {
            setShowAlert(true);
            return;
        } else {
            setShowAlert(true);
            setAlertMessage("Successfully saved markdown file.");
            setAlertStyling("default");
        }
    }

    return (
        <>

            {showAlert && <AlertUI
                message={alertMessage}
                styling={alertStyling} />}
            {/* Top nav for buttons */}
            <div className="min-w-full py-4 flex justify-end">
                <Button className="mx-4" onClick={saveMarkdown}>
                    Save Lesson
                </Button>
            </div>

            {/* Main layout */}
            <div className="h-full flex">
                {/* Editor */}
                <div className="w-1/2 border border-border flex flex-col overflow-x-auto">
                    {/* Header */}
                    <div className="bg-gray-800 text-white text-2xl font-bold px-4 h-12 py-auto items-center flex">
                        Edit Markdown File
                    </div>
                    <MarkdownEditor markdown={markdown} setMarkdown={setMarkdown} />
                </div>

                {/* Preview */}
                <div className="w-1/2 border border-border flex flex-col overflow-x-auto">
                    {/* Header */}
                    <div className="bg-gray-800 text-white text-2xl font-bold px-4 h-12 py-auto items-center flex">
                        Preview
                    </div>

                    {/* Content */}
                    <MarkdownPreview markdownContent={markdown} />
                </div>
            </div>


        </>
    )
}