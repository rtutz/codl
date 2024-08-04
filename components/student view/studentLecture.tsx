import { Button } from "../ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useState, useCallback, useRef } from "react";
import MarkdownPreview from "../markdownPreview";
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { EditorView, ViewUpdate } from '@codemirror/view';
import TerminalWindow from "../terminal";


interface IProps {
  lessonMarkdown: string
}


const StudentLecture = ({ lessonMarkdown }: IProps) => {
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
    <div className="h-screen flex flex-col text-gray-100">
      <div className="p-4 flex justify-end border-b border-gray-800">
        {/* <Button variant="outline" className="mr-2" onClick={() => }>
          Save Content
        </Button> */}
        <Button onClick={handleRunCode}>
          Run Code
        </Button>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold p-4 border-b border-gray-800">Lesson</h2>
            <div className="flex-grow overflow-auto p-4">
              <MarkdownPreview markdownContent={lessonMarkdown} />
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
                <h2 className="text-2xl font-bold p-4 border-b border-gray-800">
                  Console Output
                </h2>
                <div className="flex-grow overflow-auto rounded-md m-2">
                  <TerminalWindow pythonCode={code}terminalRef={terminalRef} ws={wsRef} runSignal={runSignal}/>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
};

export default StudentLecture;