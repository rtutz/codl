"use client"

import { useState, useEffect } from "react"

import { useLessonIdContext } from "@/app/context/lessonContext"
import AlertUI from "./error"

interface ICodingQuestion {
    id: string,
    lessonId: string,
    markdown: string
}

interface IProps {
    codingQuestions: ICodingQuestion[] | undefined,
    currQuestion: ICodingQuestion | undefined,
    updateCurrQuestionNum: (questionNum: ICodingQuestion) => void;
    setCodingQuestions: React.Dispatch<React.SetStateAction<ICodingQuestion[] | undefined>>;
}

export default function Tab({ codingQuestions, currQuestion, updateCurrQuestionNum, setCodingQuestions }: IProps) {
    const [lessonId, setLessonId] = useLessonIdContext();

    const [showAlert, setShowAlert] = useState<boolean>(false);
    let alertMessage = 'There was an error creating the new question.';
    const alertStyling = 'destructive'

    const addNewTab = async () => {
        try {
            // Make a POST request to create a new coding question
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/codingquestion`, {
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

            // Update the codingQuestions array with the new question
            setCodingQuestions(prevQuestions =>
                prevQuestions ? [...prevQuestions, newQuestion] : [newQuestion]
            );

            // Set the new question as the current question
            updateCurrQuestionNum(newQuestion);

        } catch (error) {
            console.error('Error adding new tab:', error);
            setShowAlert(true);
        }
    };

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        if (showAlert) {
            timeout = setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        }
        return () => clearTimeout(timeout);
    }, [showAlert]);


    const removeTab = async (questionToRemove: ICodingQuestion) => {
        try {
            // Make a DELETE request to remove the coding question
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/codingquestion?id=${questionToRemove.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete coding question');
            }
    
            // If the delete request was successful, update the local state
            setCodingQuestions(prev => {
                if (!prev) return prev;
                const newQuestions = prev.filter(q => q.id !== questionToRemove.id);
                if (newQuestions.length > 0 && currQuestion?.id === questionToRemove.id) {
                    updateCurrQuestionNum(newQuestions[0]);
                }
                return newQuestions;
            });
    
        } catch (error) {
            console.error('Error removing tab:', error);
            alertMessage = "Error deleting the coding question";
            setShowAlert(true);
        }
    };

    return (
        <>
            {showAlert && <AlertUI
                message={alertMessage}
                styling={alertStyling} />}
            <div className="w-1/2">
                <div className="flex min-w-full">
                    {codingQuestions?.map((item, index) => (
                        <button
                            key={item.id}
                            className={`px-4 py-2 rounded-t-2xl transition-colors duration-300 flex-shrink-0 ${item.id === currQuestion?.id
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            onClick={() => updateCurrQuestionNum(item)}>
                            Question #{index + 1}

                            {item.id === currQuestion?.id && (
                                <button
                                    className="ml-2 text-gray-500 hover:text-white text-lg"
                                    onClick={() => removeTab(item)}
                                >
                                    ×
                                </button>
                            )}
                        </button>
                    ))}

                    <button
                        className="px-4 rounded-t-lg transition-colors duration-300 
                        text-gray-300 hover:bg-gray-700 flex-shrink-0"
                        onClick={addNewTab}
                    >
                        +
                    </button>
                </div>
            </div>

        </>)
}