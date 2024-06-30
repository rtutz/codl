"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import Tab from "./tab"
import MarkdownEditor from "./markdownEditor"
import MarkdownPreview from "./markdownPreview"
import AlertUI from "./error"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import TestCases from "./testCases"

interface ICoding {
    lessonID: string
}

interface ICodingQuestion {
    id: string,
    lessonId: string,
    markdown: string
}



export default function Coding({ lessonID }: ICoding) {
    const [currQuestion, setCurrQuestion] = useState<ICodingQuestion>();
    const [codingQuestions, setCodingQuestions] = useState<ICodingQuestion[]>();

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('There was an error saving the file.');
    const [alertStyling, setAlertStyling] = useState<"default" | "destructive" | null | undefined>('destructive');

    // Get all Coding Questions associated for this lesson. Updates codingQuestions.
    useEffect(() => {
        async function getData() {
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
                setCurrQuestion(data[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        getData();
    }, [lessonID]);

    function updateCurrQuestionNum(chosenQuestion: ICodingQuestion) {
        setCurrQuestion(chosenQuestion);
    }

    const updateQuestionMarkdown = (newMarkdown: string) => {
        if (currQuestion) {
            setCurrQuestion({
                ...currQuestion,
                markdown: newMarkdown,
            });
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/codingquestion?id=${currQuestion?.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ markdown: currQuestion?.markdown }),
            cache: 'no-store',
        });

        if (!response.ok) {
            setShowAlert(true);
            return;
        } else {
            setShowAlert(true);
            setAlertMessage("Successfully saved markdown file.");
            setAlertStyling("default");

            if (currQuestion && codingQuestions) {
                const updatedCodingQuestions = codingQuestions.map((question) =>
                    question.id === currQuestion.id ? currQuestion : question
                );
                setCodingQuestions(updatedCodingQuestions);
            }
        }
    }

    return (
        <>
            {showAlert && <AlertUI
                message={alertMessage}
                styling={alertStyling} />}
            <div className="flex mt-4 justify-between">
                <Tab codingQuestions={codingQuestions} currQuestion={currQuestion} updateCurrQuestionNum={updateCurrQuestionNum} />

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