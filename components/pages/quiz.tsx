"use client"

import { useLessonIdContext } from "@/app/context/lessonContext"
import IndividualQuiz from "../individualQuiz";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon, PlusCircledIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { FaSave } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";

interface IQuizQuestion {
    id?: number;
    question: string;
    choices: { text: string; isCorrect: boolean, id: string }[];
    hint: string;
    modified: boolean
}

interface Props {
    lessonID: string;
    quizQuestions: IQuizQuestion[];
    setQuizQuestions: React.Dispatch<React.SetStateAction<IQuizQuestion[]>>;
}

export default function QuizView({ lessonID, quizQuestions, setQuizQuestions }: Props) {
    // const [lessonId, setLessonId] = useLessonIdContext();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(quizQuestions.length === 0 ? -1 : 0);
    const { toast } = useToast()

    const addNewQuestion = () => {
        setQuizQuestions([...quizQuestions, {
            question: '',
            choices: Array(4).fill({ text: '', isCorrect: false, id: null }),
            hint: '',
            modified: true
        }]);

        setCurrentQuestionIndex(0);
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex === quizQuestions.length - 1) {
            addNewQuestion();
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
    };

    const updateQuizQuestion = (updatedQuestion: IQuizQuestion) => {
        const newQuizQuestions = [...quizQuestions];
        newQuizQuestions[currentQuestionIndex] = updatedQuestion;
        newQuizQuestions[currentQuestionIndex].modified = true;
        setQuizQuestions(newQuizQuestions);
    };

    const deleteQuestion = async () => {
        const deletedQuestion = quizQuestions[currentQuestionIndex];
    
        if (deletedQuestion.id) {
            const response = await fetch(`/api/quiz`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                body: JSON.stringify({ quizId: deletedQuestion.id })
            });

            if (!response.ok) {
                throw new Error('Failed to delete data');
            }
        }
        
        const newQuizQuestions = quizQuestions.toSpliced(currentQuestionIndex, 1);
        setQuizQuestions(newQuizQuestions);
    
        // Adjust the currentQuestionIndex based on the deletion
        if (currentQuestionIndex === 0 && newQuizQuestions.length > 0) {
            // If first element was deleted and there are remaining questions,
            // stay at index 0
            setCurrentQuestionIndex(0);
        } else if (currentQuestionIndex > 0) {
            // If not the first element, move to the previous question
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        } else {
            // If the last question was deleted, set index to -1 or handle empty state
            setCurrentQuestionIndex(-1);
        }
    }
    
    const handleSaveQuestions = async () => {
        try {
            const response = await fetch(`/api/quiz?lesson_id=${lessonID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
                body: JSON.stringify({ questions: quizQuestions })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data: IQuizQuestion[] = await response.json() as IQuizQuestion[];

            setQuizQuestions(data.map(quizQuestion => ({
                ...quizQuestion,
                modified: false
            })))

            toast({
                title: "Success",
                description: "Questions successfully saved.",
                duration: 3000,
            });

        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Error",
                description: "Failed to save questions. Please try again.",
                variant: "destructive",
                duration: 3000,
            });
            return null;
        }
    }

    if (quizQuestions.length === 0) {
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
                    No questions yet
                </span>
                <p className="text-xl text-gray-600 mt-2 text-center">
                    Oh, you don't have any questions!<br />
                    Click the button above to add a question.
                </p>
            </div>
        )
    }

    return (
        <div className="mt-10 w-11/12 mx-auto">
            <div className="mt-4">
                <div className="w-full flex justify-end items-center mb-6">
                    <div className="relative group mr-4">
                        <TrashIcon
                            className="h-10 w-10 text-red-500 cursor-pointer transition-all duration-300 ease-in-out transform group-hover:scale-110"
                            onClick={deleteQuestion}
                        />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                            Delete
                        </span>
                    </div>
                    <Button
                        onClick={handleSaveQuestions}
                        variant="default"
                        disabled={quizQuestions.length === 0 || !quizQuestions.some(q => q.modified)}
                    >
                        <FaSave className="mr-2 h-4 w-4" /> Save Questions
                    </Button>
                </div>

                <div className="quiz-navigation flex justify-between items-center mb-4">
                    <Button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant="ghost"
                        size="icon"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <span className="text-white">
                        {quizQuestions.length === 0
                            ? "No questions yet"
                            : `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`
                        }
                    </span>
                    <Button
                        onClick={handleNextQuestion}
                        variant="ghost"
                        size="icon"
                    >
                        {quizQuestions.length === 0 || currentQuestionIndex === quizQuestions.length - 1 ? (
                            <PlusIcon className="h-6 w-6" />
                        ) : (
                            <ChevronRightIcon className="h-6 w-6" />
                        )}
                    </Button>
                </div>
                {quizQuestions.length > 0 && (
                    <IndividualQuiz
                        question={quizQuestions[currentQuestionIndex]}
                        onUpdate={updateQuizQuestion}
                    />
                )}
                <div className="mt-6 flex justify-center">

                </div>
            </div>
        </div>
    );
}