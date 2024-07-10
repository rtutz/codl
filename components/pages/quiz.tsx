"use client"

import { useLessonIdContext } from "@/app/context/lessonContext"
import IndividualQuiz from "../individualQuiz";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "@radix-ui/react-icons"


interface IQuizQuestion {
    id: number;
    question: string;
    choices: { text: string; isCorrect: boolean }[];
    hint: string;
}

interface Props {
    lessonID: string;
    quizQuestions: IQuizQuestion[];
    setQuizQuestions: React.Dispatch<React.SetStateAction<IQuizQuestion[]>>;
}

export default function QuizView({ lessonID, quizQuestions, setQuizQuestions }: Props) {
    const [lessonId, setLessonId] = useLessonIdContext();
    const [reload, setReload] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleNextQuestion = () => {
        if (currentQuestionIndex === quizQuestions.length - 1) {
            // Add a new question
            setQuizQuestions([...quizQuestions, {
                id: quizQuestions.length + 1,
                question: '',
                choices: Array(4).fill({ text: '', isCorrect: false }),
                hint: ''
            }]);
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
    };

    const updateQuizQuestion = (updatedQuestion: IQuizQuestion) => {
        console.log("updateQuizQuestion being called", updatedQuestion);
        const newQuizQuestions = [...quizQuestions];
        newQuizQuestions[currentQuestionIndex] = updatedQuestion;
        setQuizQuestions(newQuizQuestions);
    };

    return (
        quizQuestions.length !== 0 &&
        <div className="mt-10 w-11/12 mx-auto">
            <div className="mt-4">
                <div className="quiz-navigation flex justify-between items-center mb-4">
                    <Button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant="ghost"
                        size="icon"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <span className="text-white">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                    <Button
                        onClick={handleNextQuestion}
                        variant="ghost"
                        size="icon"
                    >
                        {currentQuestionIndex === quizQuestions.length - 1 ? (
                            <PlusIcon className="h-6 w-6" />
                        ) : (
                            <ChevronRightIcon className="h-6 w-6" />
                        )}
                    </Button>
                </div>
                <IndividualQuiz
                    key={quizQuestions[currentQuestionIndex].id} 
                    question={quizQuestions[currentQuestionIndex]}
                    onUpdate={updateQuizQuestion}
                />
            </div>
        </div>
    );
}