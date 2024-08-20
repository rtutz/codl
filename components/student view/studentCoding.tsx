'use client';

import React, { useEffect, useState, useCallback, useRef, createRef } from "react";
import AlertUI from "../error";
import Tab from "../tab"
import { Button } from "../ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import MarkdownPreview from "../markdownPreview";
import { ViewUpdate } from '@codemirror/view';
import { useClassRole } from "@/app/context/roleContext";
import useDebounce from "@/lib/useDebounce";
import TerminalWindow from "../terminal";
import { run } from "node:test";

interface ICodingQuestion {
  id: string,
  lessonId: string,
  markdown: string
}

interface ITestCases {
  id: string,
  input: string,
  output: string,
  codingQuestionId: string
}


interface IStudentCoding {
  codingQuestions: ICodingQuestion[];
  setCodingQuestions: React.Dispatch<React.SetStateAction<ICodingQuestion[]>>;
}

type TerminalRefMap = {
  [key: string]: [React.RefObject<HTMLDivElement>, React.MutableRefObject<WebSocket | null>];
};

const StudentCoding = ({ codingQuestions, setCodingQuestions }: IStudentCoding) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('There was an error saving the file.');
  const [alertStyling, setAlertStyling] = useState<"default" | "destructive" | null | undefined>('destructive');

  const [code, setCode] = useState<string>('');
  const [currQuestion, setCurrQuestion] = useState<ICodingQuestion>();
  const terminalRefMap = useRef<TerminalRefMap>({});
  const [runSignal, setRunSignal] = useState(0);
  const [testCases, setTestCases] = useState<ITestCases[]>();


  const { userId } = useClassRole();

  useEffect(() => {
    if (currQuestion) {
      const questionId = currQuestion.id;

      // Fetch data from the backend
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/question?userId=${userId}&questionId=${questionId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setCode(data.value);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }

      fetchData();
    }
  }, [currQuestion])

  useEffect(() => {
    async function getData() {
      if (currQuestion) {
        try {
          const response = await fetch(`/api/tests?id=${currQuestion.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          });

          const data = await response.json();
          console.log("Test cases are", data);
          setTestCases(data);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }

    getData();

  }, [currQuestion])


  useEffect(() => {
    if (codingQuestions.length > 0) {
      setCurrQuestion(codingQuestions[0]);
    }

    // Initialize refs for each question
    codingQuestions.forEach((question) => {
      if (!terminalRefMap.current[question.id]) {
        terminalRefMap.current[question.id] = [createRef<HTMLDivElement>(), { current: null }];
      }
    });
  }, [codingQuestions]);



  function updateCurrQuestionNum(chosenQuestion: ICodingQuestion) {
    setCurrQuestion(chosenQuestion);
  }


  const updateCode = async (value: string) => {
    try {
      const response = await fetch(`/api/question`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          questionId: currQuestion?.id,
          value,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
    } catch (error) {
      console.error('Failed to update code:', error);
    }
  };

  const debouncedUpdateCode = useDebounce(updateCode, 500);


  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    setCode(value);
    debouncedUpdateCode(value);
  }, [debouncedUpdateCode]);

  const handleRunCode = () => {
    if (currQuestion) {
      const wsRef = terminalRefMap.current[currQuestion?.id][1]
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        setRunSignal(prev => prev + 1);
        wsRef.current.send(JSON.stringify({ type: 'python', data: code }));
      } else {
        console.error('WebSocket is not connected');
      }
    }
  }

  const handleRunTests = () => {
    if (currQuestion && testCases) {
      const wsRef = terminalRefMap.current[currQuestion.id][1];
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        setRunSignal(prev => prev + 1);
        wsRef.current.send(JSON.stringify({ 
          type: 'runTests', 
          data: { code, testCases }
        }));
      } else {
        console.error('WebSocket is not connected');
      }
    }
  };


  return (
    <div className="flex-grow h-screen overflow-hidden">
      {showAlert && (
        <AlertUI message={alertMessage} styling={alertStyling} />
      )}
      <div className="flex mt-4 justify-between">
        <Tab
          codingQuestions={codingQuestions}
          currQuestion={currQuestion}
          updateCurrQuestionNum={updateCurrQuestionNum}
          setCodingQuestions={setCodingQuestions}
          role="Student"
        />
        <div>
          <Button className="mx-4 py-4" onClick={handleRunCode}>
            Run Code
          </Button>
          <Button className="mx-4 py-4" variant='secondary' onClick={handleRunTests}>
            Run Tests
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex h-full">
        <ResizablePanel defaultSize={50} minSize={30} className="h-full">
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold p-4 border-b border-gray-800">
              Lesson
            </h2>
            <div className="flex-grow overflow-auto p-4">
              <MarkdownPreview markdownContent={currQuestion?.markdown || ''} />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30} className="h-full">
          <ResizablePanelGroup direction="vertical" className="h-full">
            <ResizablePanel defaultSize={60} minSize={30} className="h-full">
              <div className="h-full flex flex-col">
                <h2 className="text-2xl font-bold p-4 border-b border-[#282C34]">
                  Code Editor
                </h2>
                <div className="flex-grow p-4 overflow-hidden bg-[#282C34]">
                  <div className="h-full overflow-auto bg-[#282C34]">
                    <CodeMirror
                      value={code}
                      extensions={[python()]}
                      onChange={onChange}
                      theme="dark"
                      className="h-full rounded-md"
                      style={{ height: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={40} minSize={20} className="h-full">
              <div className="h-full flex flex-col">
                <h2 className="text-2xl font-bold p-4 border-b border-gray-800">
                  Console Output
                </h2>
                <div className="flex-grow overflow-auto rounded-md m-2">
                  <div>
                    {currQuestion && (
                      <>
                        {console.log(code)}
                        <TerminalWindow
                          pythonCode={''}
                          terminalRef={terminalRefMap.current[currQuestion?.id][0]}
                          ws={terminalRefMap.current[currQuestion?.id][1]}
                          runSignal={runSignal}
                          key={currQuestion.id}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default StudentCoding;