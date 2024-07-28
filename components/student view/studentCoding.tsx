'use client';

import { useEffect, useState, useCallback } from "react";
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
  
  useEffect(() => {
    if (codingQuestions) {
        setCurrQuestion(codingQuestions[0]);
    }
}, [])

  async function saveMarkdown() {

  }

  function updateCurrQuestionNum(chosenQuestion: ICodingQuestion) {
    setCurrQuestion(chosenQuestion);
  }

  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    console.log('value:', value);
    setCode(value);
  }, []);



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
              setCodingQuestions={setCodingQuestions} />
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
                <pre className="flex-grow p-4 overflow-auto bg-gray-800 rounded-md m-2">
                  {consoleOutput}
                </pre>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default StudentCoding;