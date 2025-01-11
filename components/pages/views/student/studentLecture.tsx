import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useState, useCallback, useRef } from "react";
import MarkdownPreview from "@/components/editor/markdownPreview";
import CodeMirror from '@uiw/react-codemirror';
import { python, } from '@codemirror/lang-python';
import { EditorView, ViewUpdate } from '@codemirror/view';
import TerminalWindow from "@/components/coding/terminal";
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlayIcon } from "@radix-ui/react-icons";

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



interface IProps {
  lessonMarkdown: string
}

const StudentLecture = ({ lessonMarkdown }: IProps) => {
  console.log("Rendering student lecture");
  const [code, setCode] = useState('');
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [runSignal, setRunSignal] = useState(0);



  const handleRunCode = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setRunSignal(prev => prev + 1);
      wsRef.current.send(JSON.stringify({ type: 'python', data: code }));
    } else {
      console.error('WebSocket is not connected');
    }
  };


  const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
    setCode(value);
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full p-4 space-x-2"
    >
      <ResizablePanel defaultSize={50}>
        <div className="h-full  border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-secondary px-4 py-2 border-b border-zinc-600">
            <h2 className="text-zinc-200 font-semibold">Lesson</h2>
          </div>
          <div className="p-4 text-zinc-300">
            <MarkdownPreview markdownContent={lessonMarkdown} />
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
                <button
                  className="flex items-center px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 active:bg-emerald-800 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                  onClick={handleRunCode}
                >
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Run Code
                </button>
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
              <TerminalWindow pythonCode={code} terminalRef={terminalRef} ws={wsRef} runSignal={runSignal} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
};

// const StudentLecture = ({ lessonMarkdown }: IProps) => {
//   const [code, setCode] = useState('');
//   const terminalRef = useRef<HTMLDivElement | null>(null);
//   const wsRef = useRef<WebSocket | null>(null);
//   const [runSignal, setRunSignal] = useState(0);



//   const handleRunCode = () => {
//     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//       setRunSignal(prev => prev + 1);
//       wsRef.current.send(JSON.stringify({ type: 'python', data: code }));
//     } else {
//       console.error('WebSocket is not connected');
//     }
//   };


//   const onChange = useCallback((value: string, viewUpdate: ViewUpdate) => {
//     setCode(value);
//   }, []);

//   return (
//     <div className="h-screen flex flex-col text-gray-100">
//       <div className="p-4 flex justify-end border-b border-gray-800">
//         {/* <Button variant="outline" className="mr-2" onClick={() => }>
//           Save Content
//         </Button> */}
//         <Button onClick={handleRunCode}>
//           Run Code
//         </Button>
//       </div>

//       <ResizablePanelGroup direction="horizontal" className="flex-grow">
//         <ResizablePanel defaultSize={50} minSize={30}>
//           <div className="h-full flex flex-col">
//             <h2 className="text-2xl font-bold p-4 border-b border-gray-800">Lesson</h2>
//             <div className="flex-grow overflow-auto p-4">
//               <MarkdownPreview markdownContent={lessonMarkdown} />
//               <p>Some content here</p>
//             </div>
//           </div>
//         </ResizablePanel>

//         <ResizableHandle withHandle />

//         <ResizablePanel defaultSize={50} minSize={30}>
//           <ResizablePanelGroup direction="vertical">
//             <ResizablePanel defaultSize={60} minSize={30}>
//               <div className="h-full flex flex-col">
//                 <h2 className="text-2xl font-bold p-4 border-b border-[#282C34]">Code Editor</h2>
// <div className="flex-grow p-4 overflow-hidden bg-[#282C34]">
//   <div className="h-full overflow-auto bg-[#282C34]">
//     <CodeMirror
//       value={code}
//       extensions={[python()]}
//       onChange={onChange}
//       theme="dark"
//       className="h-full rounded-md"
//       style={{ height: '100%' }}
//     />
//   </div>
// </div>
//               </div>
//             </ResizablePanel>

//             <ResizableHandle withHandle />
//             <ResizablePanel defaultSize={40} minSize={20}>
//               <div className="h-full flex flex-col">
//                 <h2 className="text-2xl font-bold p-4 border-b border-gray-800">
//                   Console Output
//                 </h2>
//                 <div className="flex-grow overflow-auto rounded-md m-2">
//                   <TerminalWindow pythonCode={code}terminalRef={terminalRef} ws={wsRef} runSignal={runSignal}/>
//                 </div>
//               </div>
//             </ResizablePanel>
//           </ResizablePanelGroup>
//         </ResizablePanel>
//       </ResizablePanelGroup>
//     </div>
//   )
// };

export default StudentLecture;