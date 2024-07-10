"use client"

import { useLessonIdContext } from "@/app/context/lessonContext"
import IndividualQuiz from "../individualQuiz";
import { useState } from "react";
import { Button } from "../ui/button";

interface IQuizQuestion {
    id: number;
    question: string;
    choices: { text: string; isCorrect: boolean }[];
    hint: string;
}

const quizData: IQuizQuestion[] = [
    {
        id: 1,
        question: "Which of the following are primary colors?",
        choices: [
            { text: "Red", isCorrect: true },
            { text: "Green", isCorrect: false },
            { text: "Blue", isCorrect: true },
            { text: "Yellow", isCorrect: true }
        ],
        hint: "Think about the colors you can't create by mixing other colors."
    },
    {
        id: 2,
        question: "Which planets in our solar system have rings?",
        choices: [
            { text: "Mars", isCorrect: false },
            { text: "Jupiter", isCorrect: true },
            { text: "Saturn", isCorrect: true },
            { text: "Uranus", isCorrect: true }
        ],
        hint: "Saturn is the most famous for its rings, but it's not alone."
    },
    {
        id: 3,
        question: "Which of these languages use a non-Latin script?",
        choices: [
            { text: "French", isCorrect: false },
            { text: "Russian", isCorrect: true },
            { text: "Arabic", isCorrect: true },
            { text: "Korean", isCorrect: true }
        ],
        hint: "Consider writing systems that look distinctly different from the English alphabet."
    }
];

export default function QuizView({ lessonID }: { lessonID: string }) {
    const [lessonId, setLessonId] = useLessonIdContext();
    const [quizQuestions, setQuizQuestions] = useState<IQuizQuestion[]>(quizData);
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
        const newQuizQuestions = [...quizQuestions];
        newQuizQuestions[currentQuestionIndex] = updatedQuestion;
        setQuizQuestions(newQuizQuestions);
    };

    return (
        <div className="mt-4">
            <div className="quiz-navigation flex justify-between mb-4">
                <Button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                    Previous Question
                </Button>
                <span className="text-white">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                <Button onClick={handleNextQuestion}>
                    {currentQuestionIndex === quizQuestions.length - 1 ? 'Add New Question' : 'Next Question'}
                </Button>
            </div>
            <IndividualQuiz
                key={quizQuestions[currentQuestionIndex].id}
                question={quizQuestions[currentQuestionIndex]}
                onUpdate={updateQuizQuestion}
            />
        </div>
    );
}