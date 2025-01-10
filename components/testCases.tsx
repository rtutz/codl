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
import { PlusCircledIcon } from "@radix-ui/react-icons";

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
    console.log("testCases are", testCases)

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
        <div className="flex flex-col space-y-4 p-4 border rounded-lg shadow-sm">
        <TestCaseBtn
          id=""
          givenInput=""
          givenOutput=""
          handleSubmit={updateTest}
          message="Create New Test"
          variant="default"
        >
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Create New Test
        </TestCaseBtn>
  
        {(!testCases || testCases.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <svg
              className="h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-lg font-semibold">No test cases yet</p>
            <p>Create a new test case to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {testCases?.map((item, index) => (
              <TestCaseBtn
                key={item.id}
                id={item.id}
                givenInput={item.input}
                givenOutput={item.output}
                handleSubmit={updateTest}
                message={`Test case #${index + 1}`}
                variant="outline"
              />
            ))}
          </div>
        )}
      </div>
    )
}