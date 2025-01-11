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
import MarkdownPreview from "../editor/markdownPreview";
import { ViewUpdate } from '@codemirror/view';
import { useClassRole } from "@/app/context/roleContext";
import useDebounce from "@/lib/useDebounce";
import TerminalWindow from "../coding/terminal";
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { run } from "node:test";
import { ScrollArea } from "../ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, QuestionMarkCircledIcon, RocketIcon } from "@radix-ui/react-icons"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip";
import { useSession } from "next-auth/react";


interface ICodingQuestion {
  id: string,
  lessonId: string,
  markdown: string,
  modified: boolean
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

const customTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#020817',
    foreground: '#D4D4D4',
    caret: '#FFFFFF',
    selection: '#264F78',
    selectionMatch: '#264F7880',
    lineHighlight: '#020817',
    gutterBackground: '#020817',
    gutterForeground: '#858585',
  },
  styles: [
    { tag: t.comment, color: '#6A9955' },
    { tag: t.variableName, color: '#9CDCFE' },
    { tag: [t.string, t.special(t.brace)], color: '#CE9178' },
    { tag: t.number, color: '#B5CEA8' },
    { tag: t.bool, color: '#569CD6' },
    { tag: t.null, color: '#569CD6' },
    { tag: t.keyword, color: '#C586C0' },
    { tag: t.operator, color: '#D4D4D4' },
    { tag: t.className, color: '#4EC9B0' },
    { tag: t.definition(t.typeName), color: '#4EC9B0' },
    { tag: t.typeName, color: '#4EC9B0' },
    { tag: t.angleBracket, color: '#808080' },
    { tag: t.tagName, color: '#569CD6' },
    { tag: t.attributeName, color: '#9CDCFE' },
    { tag: t.function(t.variableName), color: '#DCDCAA' },
    { tag: t.propertyName, color: '#9CDCFE' },
  ],
});


const StudentCoding = ({ codingQuestions, setCodingQuestions }: IStudentCoding) => {
  console.log("Coding questions are", codingQuestions);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('There was an error saving the file.');
  const [alertStyling, setAlertStyling] = useState<"default" | "destructive" | null | undefined>('destructive');


  const [code, setCode] = useState<string>('');
  const [currQuestion, setCurrQuestion] = useState<ICodingQuestion>();
  const [currQuestionIndex, setCurrQuestionIndex] = useState(-1);
  const terminalRefMap = useRef<TerminalRefMap>({});
  const [runSignal, setRunSignal] = useState(0);

  const { data: session } = useSession();
  const userId = session?.user.id;

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
      if (userId) {
        fetchData();
      }
    }
  }, [currQuestion])

  useEffect(() => {
    setCurrQuestion(codingQuestions[currQuestionIndex]);
  }, [currQuestionIndex])

  // TODO: Should only run this when I try to verify my answer.
  // useEffect(() => {
  // async function getData() {
  //   if (currQuestion) {
  //     try {
  //       const response = await fetch(`/api/tests?id=${currQuestion.id}`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         cache: 'no-store',
  //       });

  //       const data = await response.json();
  //       console.log("Test cases are", data);
  //       setTestCases(data);

  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }
  // }

  //   getData();

  // }, [currQuestion])


  useEffect(() => {
    if (codingQuestions.length > 0) {
      setCurrQuestion(codingQuestions[0]);
      setCurrQuestionIndex(0);
    }

    // Initialize refs for each question
    codingQuestions.forEach((question) => {
      if (!terminalRefMap.current[question.id]) {
        terminalRefMap.current[question.id] = [createRef<HTMLDivElement>(), { current: null }];
      }
    });
  }, [codingQuestions]);

  const updateCode = async (value: string) => {
    if (userId) {
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

  async function getTestCases(): Promise<ITestCases[] | undefined> {
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
        return data;

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }

  const handleRunTests = async () => {
    const testCases = await getTestCases();
    if (!testCases || testCases?.length === 0) {
      setShowAlert(true);
      setAlertMessage("There are no tests for this question.");
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
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

  if (currQuestionIndex < 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <QuestionMarkCircledIcon className="w-24 h-24 text-gray-500 mb-4" />
        <span className="text-3xl font-semibold text-gray-400">
          No challenges available
        </span>
        <p className="text-xl text-gray-500 mt-2">
          Ask your teacher to add some challenges!
        </p>
      </div>
    )
  }


  return (
    <>
      {showAlert && (
        <AlertUI message={alertMessage} styling={alertStyling} />
      )}
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full p-4 space-x-2"
      >
        <ResizablePanel defaultSize={50}>
          <div className="h-full border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
            <div className="bg-secondary px-4 py-2 border-b border-zinc-600 flex justify-between items-center">
              <h2 className="text-zinc-200 font-semibold">Challenge</h2>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <div className="flex space-x-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-900 transition-colors" disabled={currQuestionIndex <= 0} onClick={() => setCurrQuestionIndex(currQuestionIndex - 1)}>
                          <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{currQuestionIndex <= 0 ? "You're at the first challenge" : "Previous Challenge"}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-900 transition-colors" disabled={currQuestionIndex >= codingQuestions.length - 1} onClick={() => setCurrQuestionIndex(currQuestionIndex + 1)}>
                          <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{currQuestionIndex >= codingQuestions.length - 1 ? "You've reached the last challenge" : "Next Challenge"}</p>
                      </TooltipContent>
                    </Tooltip>
                    {/* <Tooltip>
                    <TooltipTrigger>
                      <Button variant="ghost" size="icon" className="hover:bg-gray-900 transition-colors">
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>New Challenge</p>
                    </TooltipContent>
                  </Tooltip> */}
                  </div>
                </TooltipProvider>
              </div>
            </div>
            <div className="p-4 text-zinc-300">
              <MarkdownPreview markdownContent={currQuestion?.markdown || ''} />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-zinc-700 hover:bg-zinc-600" />

        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical" className="space-y-2">
            <ResizablePanel defaultSize={70}>
              <div className="flex flex-col h-full border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                <div className="bg-secondary px-4 py-2 border-b border-zinc-600 flex justify-between items-center sticky top-0 z-10">
                  <h2 className="text-zinc-200 font-semibold">Editor</h2>
                  <div className="flex space-x-3">
                    <button
                      className="flex items-center px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 active:bg-emerald-800 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                      onClick={handleRunCode}
                    >
                      <PlayIcon className="w-4 h-4 mr-2" />
                      Run Code
                    </button>
                    <button
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                      onClick={handleRunTests}
                    >
                      <RocketIcon className="w-4 h-4 mr-2" />
                      Run Tests
                    </button>
                  </div>
                </div>
                {/* <div className="flex-grow overflow-auto"> */}
                <ScrollArea className="flex-grow">
                  <CodeMirror
                    value={code}
                    extensions={[python()]}
                    onChange={onChange}
                    theme={customTheme}
                    className="h-full rounded-md"
                  />
                </ScrollArea>
                {/* </div> */}
              </div>
            </ResizablePanel>


            <ResizableHandle withHandle className="bg-zinc-700 hover:bg-zinc-600" />

            <ResizablePanel defaultSize={30}>
              <div className="h-full border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                <div className="bg-secondary px-4 py-2 border-b border-zinc-600">
                  <h2 className="text-zinc-200 font-semibold">Console</h2>
                </div>
                {currQuestion && (
                  <TerminalWindow
                    pythonCode={''}
                    terminalRef={terminalRefMap.current[currQuestion?.id][0]}
                    ws={terminalRefMap.current[currQuestion?.id][1]}
                    runSignal={runSignal}
                    key={currQuestion.id}
                  />
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};
// const StudentCoding = ({ codingQuestions, setCodingQuestions }: IStudentCoding) => {
//   const [showAlert, setShowAlert] = useState<boolean>(false);
//   const [alertMessage, setAlertMessage] = useState<string>('There was an error saving the file.');
//   const [alertStyling, setAlertStyling] = useState<"default" | "destructive" | null | undefined>('destructive');

//   const [code, setCode] = useState<string>('');
//   const [currQuestion, setCurrQuestion] = useState<ICodingQuestion>();
//   const terminalRefMap = useRef<TerminalRefMap>({});
//   const [runSignal, setRunSignal] = useState(0);
//   const [testCases, setTestCases] = useState<ITestCases[]>();


//   const { userId } = useClassRole();

//   useEffect(() => {
//     if (currQuestion) {
//       const questionId = currQuestion.id;

//       // Fetch data from the backend
//       const fetchData = async () => {
//         try {
//           const response = await fetch(`/api/question?userId=${userId}&questionId=${questionId}`);
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           const data = await response.json();
//           setCode(data.value);
//         } catch (error) {
//           console.error('Failed to fetch data:', error);
//         }
//       }

//       fetchData();
//     }
//   }, [currQuestion])

//   useEffect(() => {
//     async function getData() {
//       if (currQuestion) {
//         try {
//           const response = await fetch(`/api/tests?id=${currQuestion.id}`, {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             cache: 'no-store',
//           });

//           const data = await response.json();
//           console.log("Test cases are", data);
//           setTestCases(data);

//         } catch (error) {
//           console.error('Error fetching data:', error);
//         }
//       }
//     }

//     getData();

//   }, [currQuestion])


//   useEffect(() => {
//     if (codingQuestions.length > 0) {
//       setCurrQuestion(codingQuestions[0]);
//     }

//     // Initialize refs for each question
//     codingQuestions.forEach((question) => {
//       if (!terminalRefMap.current[question.id]) {
//         terminalRefMap.current[question.id] = [createRef<HTMLDivElement>(), { current: null }];
//       }
//     });
//   }, [codingQuestions]);



//   function updateCurrQuestionNum(chosenQuestion: ICodingQuestion) {
//     setCurrQuestion(chosenQuestion);
//   }


//   const updateCode = async (value: string) => {
//     try {
//       const response = await fetch(`/api/question`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId,
//           questionId: currQuestion?.id,
//           value,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//     } catch (error) {
//       console.error('Failed to update code:', error);
//     }
//   };

//   const debouncedUpdateCode = useDebounce(updateCode, 500);


//   const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
//     setCode(value);
//     debouncedUpdateCode(value);
//   }, [debouncedUpdateCode]);

//   const handleRunCode = () => {
//     if (currQuestion) {
//       const wsRef = terminalRefMap.current[currQuestion?.id][1]
//       if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//         setRunSignal(prev => prev + 1);
//         wsRef.current.send(JSON.stringify({ type: 'python', data: code }));
//       } else {
//         console.error('WebSocket is not connected');
//       }
//     }
//   }

//   const handleRunTests = () => {
//     if (currQuestion && testCases) {
//       const wsRef = terminalRefMap.current[currQuestion.id][1];
//       if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//         setRunSignal(prev => prev + 1);
//         wsRef.current.send(JSON.stringify({
//           type: 'runTests',
//           data: { code, testCases }
//         }));
//       } else {
//         console.error('WebSocket is not connected');
//       }
//     }
//   };


//   return (
//     <div className="flex-grow h-screen overflow-hidden">
// {showAlert && (
//   <AlertUI message={alertMessage} styling={alertStyling} />
// )}
//       <div className="flex mt-4 justify-between">
//         <Tab
//           codingQuestions={codingQuestions}
//           currQuestion={currQuestion}
//           updateCurrQuestionNum={updateCurrQuestionNum}
//           setCodingQuestions={setCodingQuestions}
//           role="Student"
//         />
//         <div>
//           <Button className="mx-4 py-4" onClick={handleRunCode}>
//             Run Code
//           </Button>
//           <Button className="mx-4 py-4" variant='secondary' onClick={handleRunTests} disabled={!testCases || testCases.length === 0} >
//             Run Tests
//           </Button>
//         </div>
//       </div>

//       <ResizablePanelGroup direction="horizontal" className="flex h-full">
//         <ResizablePanel defaultSize={50} minSize={30} className="h-full">
//           <div className="h-full flex flex-col">
//             <h2 className="text-2xl font-bold p-4 border-b border-gray-800">
//               Lesson
//             </h2>
//             <div className="flex-grow overflow-auto p-4">
//               <MarkdownPreview markdownContent={currQuestion?.markdown || ''} />
//             </div>
//           </div>
//         </ResizablePanel>

//         <ResizableHandle withHandle />

//         <ResizablePanel defaultSize={50} minSize={30} className="h-full">
//           <ResizablePanelGroup direction="vertical" className="h-full">
//             <ResizablePanel defaultSize={60} minSize={30} className="h-full">
//               <div className="h-full flex flex-col">
//                 <h2 className="text-2xl font-bold p-4 border-b border-[#282C34]">
//                   Code Editor
//                 </h2>
//                 <div className="flex-grow p-4 overflow-hidden bg-[#282C34]">
//                   <div className="h-full overflow-auto bg-[#282C34]">
//                     <CodeMirror
//                       value={code}
//                       extensions={[python()]}
//                       onChange={onChange}
//                       theme="dark"
//                       className="h-full rounded-md"
//                       style={{ height: '100%' }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </ResizablePanel>

//             <ResizableHandle withHandle />

//             <ResizablePanel defaultSize={40} minSize={20} className="h-full">
//               <div className="h-full flex flex-col">
//                 <h2 className="text-2xl font-bold p-4 border-b border-gray-800">
//                   Console Output
//                 </h2>
//                 <div className="flex-grow overflow-auto rounded-md m-2">
//                   <div>
//                     {currQuestion && (
//                       <>
//                         {console.log(code)}
//                         <TerminalWindow
//                           pythonCode={''}
//                           terminalRef={terminalRefMap.current[currQuestion?.id][0]}
//                           ws={terminalRefMap.current[currQuestion?.id][1]}
//                           runSignal={runSignal}
//                           key={currQuestion.id}
//                         />
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </ResizablePanel>
//           </ResizablePanelGroup>
//         </ResizablePanel>
//       </ResizablePanelGroup>
//     </div>
//   );
// };

export default StudentCoding;