'use client';

import { useEffect, useState, useCallback, useRef } from "react";
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

interface ICodingQuestion {
  id: string,
  lessonId: string,
  markdown: string
}

interface IStudentCoding {
  codingQuestions: ICodingQuestion[] | undefined;
  setCodingQuestions: React.Dispatch<React.SetStateAction<ICodingQuestion[] | undefined>>;
}

const StudentCoding = ({ codingQuestions, setCodingQuestions }: IStudentCoding) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('There was an error saving the file.');
  const [alertStyling, setAlertStyling] = useState<"default" | "destructive" | null | undefined>('destructive');

  const [consoleOutput, setConsoleOutput] = useState('Testing');
  const [code, setCode] = useState('test');
  const [currQuestion, setCurrQuestion] = useState<ICodingQuestion>();
  const terminalRef = useRef<HTMLDivElement | null>(null);

  const { userId } = useClassRole();

  useEffect(() => {
    if (currQuestion) {
      const questionId = currQuestion.id;

      // Fetch data from the backend
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/codingquestion?userId=${userId}&questionId=${questionId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('backend response', data);
          setCode(data.value);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }

      fetchData();
    }
  }, [currQuestion])


  useEffect(() => {
    if (codingQuestions) {
      console.log('first question', codingQuestions[0]);
      setCurrQuestion(codingQuestions[0]);
    }
  }, [])

  async function saveMarkdown() {

  }

  function updateCurrQuestionNum(chosenQuestion: ICodingQuestion) {
    setCurrQuestion(chosenQuestion);
  }


  const updateCode = async (value: string) => {
    try {
      const response = await fetch(`/api/codingquestion`, {
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
      console.log('Updated code:', data);
    } catch (error) {
      console.error('Failed to update code:', error);
    }
  };

  const debouncedUpdateCode = useDebounce(updateCode, 500);


  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    console.log('value:', value);
    setCode(value);
    debouncedUpdateCode(value);
  }, [debouncedUpdateCode]);



  console.log("codingQuestions", codingQuestions);
  return (
    <>
      {showAlert && <AlertUI
        message={alertMessage}
        styling={alertStyling} />}
      <div className="flex mt-4 justify-between">
        <Tab codingQuestions={codingQuestions}
          currQuestion={currQuestion}
          updateCurrQuestionNum={updateCurrQuestionNum}
          setCodingQuestions={setCodingQuestions}
          role='Student' />
        <Button className="mx-4 py-4" onClick={saveMarkdown}>
          Save
        </Button>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold p-4 border-b border-gray-800">Lesson</h2>
            <div className="flex-grow overflow-auto p-4">
              <MarkdownPreview markdownContent={currQuestion?.markdown || ''} />
              <p>Some content here</p>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="h-full flex flex-col">
                <h2 className="text-2xl font-bold p-4 border-b border-[#282C34]">Code Editor</h2>
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

            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="h-full flex flex-col">
                <h2 className="text-2xl font-bold p-4 border-b border-gray-800">Console Output</h2>
                <div className="flex-grow overflow-auto rounded-md m-2">
                  {currQuestion && <TerminalWindow terminalData={currQuestion?.markdown || ''} terminalRef={terminalRef} />}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default StudentCoding;