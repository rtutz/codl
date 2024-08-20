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
        try {
            let response;
            if (!id) {
                // Create a new test
                response = await fetch('/api/tests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ input, output, codingQuestionId }),
                });
            } else {
                // Update test
                response = await fetch('/api/tests', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id, input, output }),
                });
            }

            if (response.ok) {
                const updatedTestCase = await response.json();
                setTestCases((prevTestCases) => {
                    if (!id) {
                        // Add new test case
                        return [...(prevTestCases || []), updatedTestCase];
                    } else {
                        // Update existing test case
                        return prevTestCases?.map((tc) =>
                            tc.id === id ? updatedTestCase : tc
                        ) || [];
                    }
                });
            } else {
                console.error('Failed to update test case');
            }
        } catch (error) {
            console.error('Error updating test case:', error);
        }
    }


    return (
        <div className="flex flex-col">
            <TestCaseBtn id='' givenInput='' givenOutput='' handleSubmit={updateTest} message='Create New Test'  variant='default'/>

            <div className="space-y-2 mt-2">
                {testCases?.map((item, index) => (
                    <TestCaseBtn key={item.id} id={item.id} givenInput={item.input} givenOutput={item.output} handleSubmit={updateTest} message={`Test case #${index + 1}`} variant='outline'/>
                ))}
            </div>
        </div>
    )
}