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

    const updateQuestionMarkdown = (newMarkdown: { markdown: string }) => {
        if (currQuestion) {
            setCurrQuestion({
                ...currQuestion,
                markdown: newMarkdown.markdown,
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
                <div className="w-1/2 border border-border border-t-0 flex flex-col overflow-x-auto">
                    {/* Header */}
                    <div className="bg-gray-800 text-2xl font-black p-2">Edit Markdown File</div>
                    <MarkdownEditor markdown={currQuestion?.markdown} setMarkdown={updateQuestionMarkdown} />
                </div>
                <div className="w-1/2 border border-border flex flex-col overflow-x-auto">
                    {/* Header */}
                 
                    <Tabs defaultValue="preview" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="tests">Test Cases</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview">
                    <MarkdownPreview markdownContent={currQuestion?.markdown || ''} />
                    </TabsContent>
                    <TabsContent value="tests">
                        <TestCases codingQuestionId={currQuestion?.id || ''}/>
                    </TabsContent>
                    </Tabs>
                    {/* Content */}
                    
                </div>
            </div>

        </>
    )
}