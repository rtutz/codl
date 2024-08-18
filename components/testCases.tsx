"use client"

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import TestCaseBtn from "./TestCaseBtn";

interface ITestCases {
    id: string,
    input: string,
    output: string,
    codingQuestionId: string
}

interface ITestCasesProp {
    codingQuestionId: string
}

export default function TestCases({ codingQuestionId }: ITestCasesProp) {
    const [testCases, setTestCases] = useState<ITestCases[]>();


    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(`/api/tests?id=${codingQuestionId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                const data = await response.json();
                setTestCases(data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        getData();

    }, [codingQuestionId])

    async function updateTest(id: string, input: string, output: string) {

        // Create a new test
        if (!id) {
            console.log("working")
        } 

        // Update test 
        else {

        }

    }

    return (
        <div className="flex flex-col">
            <TestCaseBtn id='' givenInput='' givenOutput='' handleSubmit={updateTest} message='Create New Test'/>

            <div>
            {testCases?.map((item, index) => (
                <TestCaseBtn key={item.id} id={item.id} givenInput={item.input} givenOutput={item.output} handleSubmit={updateTest} message={`Test case #${index + 1}`}/>
            ))}
            </div>

 
        </div>
    )

}