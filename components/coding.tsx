"use client"
import { useMarkdown } from "@/providers/markdownProvider"
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
    dracula,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Button } from "./ui/button";
import AlertUI from "./error";

interface ILecture {
    lectureContent: string,
    lessonID: string
}

export default function Coding({ lectureContent, lessonID }: ILecture) {
    const { markdown, setMarkdown } = useMarkdown();
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('There was an error saving the file.');
    const [alertStyling, setAlertStyling] = useState<"default" | "destructive" | null | undefined>('destructive');

    useEffect(() => {
        setMarkdown({ markdown: lectureContent });
    }, [lectureContent]);

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
            body: JSON.stringify({ markdown: markdown.markdown }),
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
                    Save
                </Button>
            </div>

            {/* Main layout */}
            <div className="h-full flex">
                {/* Editor */}
                <div className="w-1/2 border border-border flex flex-col overflow-x-auto">
                    {/* Header */}
                    <div>Header</div>
                    <textarea
                        className="flex-grow bg-transparent focus:outline-none resize-none w-full p-4"
                        value={markdown.markdown}
                        onChange={(e) => setMarkdown({ markdown: e.target.value })}
                    />
                </div>

                {/* Preview */}
                <div className="w-1/2 border border-border flex flex-col overflow-x-auto">
                    {/* Header */}
                    <div>Preview</div>

                    {/* Content */}
                    <article className="prose prose-headings:text-white prose-p:text-white min-w-full p-4">
                        <ReactMarkdown
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={dracula}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code>{children}</code>
                                    );
                                },
                            }}
                        >
                            {markdown.markdown}
                        </ReactMarkdown>
                    </article>
                </div>
            </div>


        </>
    )
}