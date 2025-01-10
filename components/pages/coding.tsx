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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable"
import { ScrollArea } from "../ui/scroll-area"
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlusCircledIcon, PlusIcon } from "@radix-ui/react-icons"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface ICoding {
    lessonID: string;
    codingQuestions: ICodingQuestion[];
    setCodingQuestions: React.Dispatch<React.SetStateAction<ICodingQuestion[]>>;
}
interface ICodingQuestion {
    id: string,
    lessonId: string,
    markdown: string,
    modified: boolean
}



export default function Coding({ lessonID, codingQuestions, setCodingQuestions }: ICoding) {
    const [currQuestion, setCurrQuestion] = useState<ICodingQuestion>();
    const [currQuestionIndex, setCurrQuestionIndex] = useState(codingQuestions.length === 0 ? -1 : 0);
    
    useEffect(() => {
        setCurrQuestion(codingQuestions[currQuestionIndex]);
    }, [currQuestionIndex])

    const [lessonId, setLessonId] = useLessonIdContext();

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('There was an error saving the file.');
    const [alertStyling, setAlertStyling] = useState<"default" | "destructive" | null | undefined>('destructive');

    const updateQuestionMarkdown = (newMarkdown: string) => {
        if (currQuestion) {
            const updatedQuestion = {
                ...currQuestion,
                markdown: newMarkdown,
                modified: true
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
            setCurrQuestion({ ...currQuestion, modified: false });

            // Update codingQuestions
            setCodingQuestions(prevQuestions =>
                prevQuestions?.map(q =>
                    q.id === currQuestion.id ? { ...currQuestion, modified: false } : q
                )
            );
        }
    }

    const addNewQuestion = async () => {
        try {
            // Make a POST request to create a new coding question
            const response = await fetch(`/api/question`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lessonId: lessonId, // Use the lessonId from context
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create new coding question');
            }

            const newQuestion: ICodingQuestion = await response.json();

            // Set the new question as the current question
            setCurrQuestionIndex(codingQuestions.length);

            // Update the codingQuestions array with the new question
            setCodingQuestions(prevQuestions =>
                prevQuestions ? [...prevQuestions, newQuestion] : [newQuestion]
            );

        } catch (error) {
            console.error('Error adding new tab:', error);
            setShowAlert(true);
        }
    };

    if (codingQuestions.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center h-screen">
            <button
              onClick={addNewQuestion}
              className="group transition-transform duration-200 hover:scale-110"
              aria-label="Add new question"
            >
              <PlusCircledIcon className="w-24 h-24 text-gray-700 mb-4 group-hover:text-gray-600" />
            </button>
            <span className="text-3xl font-semibold text-gray-700">
              No challenges yet
            </span>
            <p className="text-xl text-gray-600 mt-2 text-center">
              Oh, you don't have any challenges!<br />
              Click the button above to add a challenge.
            </p>
          </div>
        )
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
                    <div className="h-full border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                        <div className="bg-secondary px-4 py-2 border-b border-zinc-600 flex justify-between items-center">
                            <h2 className="text-zinc-200 font-semibold">Editor</h2>
                            <div className="flex space-x-2">
                                <TooltipProvider>
                                    <div className="flex space-x-2">
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button variant="ghost" size="icon" className="hover:bg-gray-900 transition-colors" disabled={currQuestionIndex <= 0} onClick={() => setCurrQuestionIndex(currQuestionIndex - 1)}>
                                                    <ChevronLeftIcon className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{currQuestionIndex <= 0 ? "You're at the first challenge" : "Previous Challenge"}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button variant="ghost" size="icon" className="hover:bg-gray-900 transition-colors" disabled={currQuestionIndex >= codingQuestions.length - 1} onClick={() => setCurrQuestionIndex(currQuestionIndex + 1)}>
                                                    <ChevronRightIcon className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{currQuestionIndex >= codingQuestions.length - 1 ? "You've reached the last challenge" : "Next Challenge"}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Button variant="ghost" size="icon" className="hover:bg-gray-900 transition-colors" onClick={addNewQuestion}>
                                                    <PlusIcon className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>New Challenge</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </TooltipProvider>
                            </div>
                        </div>
                        <MarkdownEditor
                            markdown={currQuestion?.markdown}
                            setMarkdown={updateQuestionMarkdown}
                        />
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle className="bg-zinc-700 hover:bg-zinc-600" />
                {/* <ResizablePanel defaultSize={50}>
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
                                <MarkdownPreview markdownContent={currQuestion?.markdown || ''} />
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel> */}
                <ResizablePanel defaultSize={50}>
                    <div className="h-full border border-zinc-700 rounded-lg shadow-xl overflow-hidden flex flex-col">
                        <Tabs defaultValue="lesson">
                            <div className="bg-secondary px-4 py-2 border-b border-zinc-600 flex justify-between items-center sticky top-0 z-10">

                                <TabsList>
                                    <TabsTrigger value="lesson">Lesson</TabsTrigger>
                                    <TabsTrigger value="testcases">Test Cases</TabsTrigger>
                                </TabsList>

                                <Button
                                    variant="default"
                                    className="bg-emerald-700 hover:bg-emerald-600 text-white"
                                    disabled={!currQuestion?.modified}
                                    onClick={saveMarkdown}
                                >
                                    <CheckIcon className="w-4 h-4 mr-2" />
                                    Save Challenge
                                </Button>
                            </div>
                            <ScrollArea className="flex-grow">
                                <div className="p-4 text-zinc-300">
                                    <TabsContent value="lesson">
                                        <MarkdownPreview markdownContent={currQuestion?.markdown || 'Start Writing!'} />
                                    </TabsContent>
                                    <TabsContent value="testcases">
                                        <TestCases codingQuestionId={currQuestion?.id || ''} />
                                    </TabsContent>
                                </div>
                            </ScrollArea>

                        </Tabs>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>


            {/* <div className="flex mt-4 justify-between">
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
            </div> */}
        </>
    )
}