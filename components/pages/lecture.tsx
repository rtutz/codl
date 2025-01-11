"use client"
import { useMarkdown } from "@/providers/markdownProvider"
import { useLessonIdContext } from "@/components/lessons/lessonContext"
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import AlertUI from "../error";
import MarkdownPreview from "../editor/markdownPreview";
import MarkdownEditor from "../editor/markdownEditor";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { ScrollArea } from "../ui/scroll-area";
import { CheckIcon } from "@radix-ui/react-icons";

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
        const response = await fetch(`/api/lesson?lesson_id=${lessonID}`, {
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

            <ResizablePanelGroup
                direction="horizontal"
                className="h-full p-4 space-x-2"
            >
                <ResizablePanel defaultSize={50}>
                    <div className="h-full border border-zinc-700 rounded-lg shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-secondary px-4 py-2 border-b border-zinc-600">
                            <h2 className="text-zinc-200 font-semibold">Editor</h2>
                        </div>
                        <MarkdownEditor markdown={markdown} setMarkdown={setMarkdown} />
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle className="bg-zinc-700 hover:bg-zinc-600" />
                <ResizablePanel defaultSize={50}>
                    <div className="h-full border border-zinc-700 rounded-lg shadow-xl overflow-hidden flex flex-col">
                        <div className="bg-secondary px-4 py-2 border-b border-zinc-600 flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-zinc-200 font-semibold">Lesson</h2>
                            <button
                                className="flex items-center px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 active:bg-emerald-800 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                                onClick={saveMarkdown}
                            >
                                <CheckIcon className="w-4 h-4 mr-2" />
                                Save Lesson
                            </button>
                        </div>
                        <ScrollArea className="flex-grow">
                            <div className="p-4 text-zinc-300">
                                <MarkdownPreview markdownContent={markdown} />
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
            {/* <div className="h-full flex">
                <div className="w-1/2 border border-border flex flex-col overflow-x-auto">
                    <div className="bg-gray-800 text-white text-2xl font-bold px-4 h-12 py-auto items-center flex">
                        Edit Markdown File
                    </div>
                    <MarkdownEditor markdown={markdown} setMarkdown={setMarkdown} />
                </div>

                <div className="w-1/2 border border-border flex flex-col overflow-x-auto">
                    <div className="bg-gray-800 text-white text-2xl font-bold px-4 h-12 py-auto items-center flex">
                        Preview
                    </div>
                    <MarkdownPreview markdownContent={markdown} />
                </div>
            </div> */}


        </>
    )
}