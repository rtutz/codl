"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import Tabs from "./tabs"

interface ICoding {
    lessonID: string
}

interface ICodingQuestion {
    id: number,
    lessonId: string,
    questionNumber: number,
    markdown: string
}

interface ITestCases {
    id: number,
    input: string,
    output: string,
    lessonId: string,
    questionNumber: number
}

export default function Coding({lessonID} : ICoding) {
    const [currQuestionNum, setCurrQuestionNum] = useState<number>(1);
    const [codingQuestions, setCodingQuestions] = useState<ICodingQuestion[]>();
    const [testCases, setTestCases] = useState<ITestCases>();

    // Get all Coding Questions associated for this lesson. Updates codingQuestions.
    useEffect(() => {
        async function getData() {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/codingQuestion?lesson_id=${lessonID}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              cache: 'no-store',
            });
            
            const data = await response.json();
            console.log(data);
            setCodingQuestions(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
    
        getData();
      }, [lessonID]); 

    // Get all test cases for currQuestionNum. This changes everytime you click a new question.
    // Updates testCases.
    useEffect(() => {

    }, [currQuestionNum]);

    function updateCurrQuestionNum(chosenQuestionNum: number) {
        setCurrQuestionNum(chosenQuestionNum);
    }

    // Get 
    return (
        <>
        <Tabs codingQuestions={codingQuestions} currQuestionNum={currQuestionNum} updateCurrQuestionNum={updateCurrQuestionNum}/>
        </>
    )
}