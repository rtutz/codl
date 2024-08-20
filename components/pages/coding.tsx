"use client"

import { useEffect, useState } from "react"
import { useLessonIdContext } from "@/app/context/lessonContext"
import { Button } from "../ui/button"
import Tab from "../tab"
import MarkdownEditor from "../markdownEditor"
import MarkdownPreview from "../markdownPreview"
import AlertUI from "../error"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import TestCases from "../testCases"

interface ICoding {
    lessonID: string;
    codingQuestions: ICodingQuestion[] | undefined;
    setCodingQuestions: React.Dispatch<React.SetStateAction<ICodingQuestion[]>>;
}
interface ICodingQuestion {
    id: string,
    lessonId: string,
    markdown: string
}



export default function Coding({ lessonID, codingQuestions, setCodingQuestions }: ICoding) {
    const [currQuestion, setCurrQuestion] = useState<ICodingQuestion>();

    // TODO: Ensure that when I create a new lesson, I have at least one question associated with it.
    useEffect(() => {
        if (codingQuestions) {
            setCurrQuestion(codingQuestions[0]);
        }
    }, [])
    const [lessonId, setLessonId] = useLessonIdContext();

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('There was an error saving the file.');
    const [alertStyling, setAlertStyling] = useState<"default" | "destructive" | null | undefined>('destructive');

    function updateCurrQuestionNum(chosenQuestion: ICodingQuestion) {
        setCurrQuestion(chosenQuestion);
    }

    const updateQuestionMarkdown = (newMarkdown: string) => {
        if (currQuestion) {
            const updatedQuestion = {
                ...currQuestion,
                markdown: newMarkdown,
            };
            setCurrQuestion(updatedQuestion);

            // Update the question in codingQuestions array
            setCodingQuestions(prevQuestions =>
                prevQuestions?.map(q =>
                    q.id === updatedQuestion.id ? updatedQuestion : q
                )
            );
        }
    };

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
        if (!currQuestion) return; // Early return if currQuestion is undefined

        const response = await fetch(`/api/question?id=${currQuestion.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ markdown: currQuestion.markdown }),
            cache: 'no-store',
        });

        if (!response.ok) {
            setShowAlert(true);
            setAlertMessage('There was an error saving the file.');
            setAlertStyling('destructive');
        } else {
            setShowAlert(true);
            setAlertMessage("Successfully saved markdown file.");
            setAlertStyling("default");

            // Update currQuestion (this is not strictly necessary if you're not changing anything)
            setCurrQuestion({ ...currQuestion });

            // Update codingQuestions
            setCodingQuestions(prevQuestions =>
                prevQuestions?.map(q =>
                    q.id === currQuestion.id ? { ...currQuestion } : q
                )
            );
        }
    }

    return (
        <>
            {showAlert && <AlertUI
                message={alertMessage}
                styling={alertStyling} />}
            <div className="flex mt-4 justify-between">
                <Tab codingQuestions={codingQuestions} currQuestion={currQuestion} updateCurrQuestionNum={updateCurrQuestionNum} setCodingQuestions={setCodingQuestions} />

                <Button className="mx-4 py-4" onClick={saveMarkdown}>
                    Save
                </Button>

            </div>

            <div className="h-full flex">
                <div className="w-1/2 border-r border-border flex flex-col overflow-hidden">
                    <div className="bg-gray-800 text-white text-2xl font-bold px-4 h-12 py-auto items-center flex">
                        Edit Markdown File
                    </div>
                    <div className="flex-grow overflow-auto">
                        <MarkdownEditor
                            markdown={currQuestion?.markdown}
                            setMarkdown={updateQuestionMarkdown}
                        />
                    </div>
                </div>
                <div className="w-1/2 flex flex-col overflow-hidden">
                    <Tabs defaultValue="preview" className="w-full h-full flex flex-col">
                        <div className="bg-gray-800 text-white px-4 h-12 flex items-center">
                            <TabsList className="inline-flex bg-gray-700 rounded-md">
                                <TabsTrigger
                                    value="preview"
                                    className="px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 rounded-l-md transition-colors"
                                >
                                    Preview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="tests"
                                    className="px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 rounded-r-md transition-colors"
                                >
                                    Test Cases
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="preview" className="flex-grow overflow-auto p-4">
                            <MarkdownPreview markdownContent={currQuestion?.markdown || ''} />
                        </TabsContent>
                        <TabsContent value="tests" className="flex-grow overflow-auto p-4">
                            <TestCases codingQuestionId={currQuestion?.id || ''} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}