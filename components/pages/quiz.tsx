"use client"

import { useLessonIdContext } from "@/app/context/lessonContext"
import IndividualQuiz from "../individualQuiz";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "@radix-ui/react-icons"
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

    const handleNextQuestion = () => {
        if (currentQuestionIndex === quizQuestions.length - 1) {
            // Add a new question
            setQuizQuestions([...quizQuestions, {
                question: '',
                choices: Array(4).fill({ text: '', isCorrect: false, id: null }),
                hint: '',
                modified: true
            }]);
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
        console.log(newQuizQuestions);
        setQuizQuestions(newQuizQuestions);
    };

    const handleSaveQuestions = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quiz?lesson_id=${lessonID}`, {
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

    return (
        <div className="mt-10 w-11/12 mx-auto">
            <div className="mt-4">
                <div className="w-full flex justify-end mb-4">
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