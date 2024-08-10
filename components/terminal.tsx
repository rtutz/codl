"use client";

import { Terminal } from '@xterm/xterm';
import { useRef, useEffect, RefObject } from 'react';
import 'xterm/css/xterm.css';

interface ITerminalWindow {
    terminalRef: React.RefObject<HTMLDivElement>;
    pythonCode: string;
    ws: React.MutableRefObject<WebSocket | null>;
    runSignal: number;
}

const TerminalWindow: React.FC<ITerminalWindow> = ({ terminalRef, pythonCode, ws, runSignal }) => {
    const term = useRef<Terminal | null>(null);
    const inputBufferRef = useRef<string>('');

    useEffect(() => {
        if (term.current) {
            term.current.clear();
        }
    }, [runSignal]);

    useEffect(() => {
        if (!terminalRef.current) return;

        if (!term.current) {
            term.current = new Terminal();
            term.current.open(terminalRef.current);

            // Initialize WebSocket connection
            ws.current = new WebSocket('ws://localhost:8080');

            ws.current.onopen = () => {
                console.log('Connected to WebSocket server');
            };

            ws.current.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === 'output') {
                    term.current?.write(message.data);
                } else if (message.type === 'exit') {
                    term.current?.write(`\r\n${message.data}\r\n`);
                } else if (message.error) {
                    term.current?.write(`Error: ${message.error}\r\n`);
                }
            };

            ws.current.onclose = () => {
                console.log('Disconnected from WebSocket server');
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        }

        return () => {
            if (term.current) {
                term.current.dispose();
                term.current = null;
            }
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };
    }, [terminalRef]);

    const handleInput = (data: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            if (data === '\r') { // Enter key pressed
                ws.current.send(JSON.stringify({ type: 'input', data: inputBufferRef.current }));
                inputBufferRef.current = '';
                if (term.current) {
                    term.current.write('\r\n'); // Move to a new line in the terminal
                }
            } else if (data === '\u007F') { // Backspace
                if (inputBufferRef.current.length > 0) {
                    inputBufferRef.current = inputBufferRef.current.slice(0, -1);
                    console.log("Input buffer is", inputBufferRef.current);

                    if (term.current) {
                        // Move the cursor back, overwrite with a space, and move back again
                        term.current.write('\b \b');
                    }
                }
            } else {
                inputBufferRef.current += data;
                if (term.current) {
                    term.current.write(data); // Echo the new character to the terminal
                }
            }
        }
    };
    useEffect(() => {
        if (term.current) {
            term.current.onData(handleInput);
        }
    }, []);

    return (
        <div ref={terminalRef} style={{ height: '100%', width: '100%' }}>
        </div>
    );
};

export default TerminalWindow;