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
            term.current = new Terminal({
                cursorBlink: true,
                fontSize: 14,
                fontFamily: 'Consolas, monospace',
                theme: {
                    background: '#020817'
                },
                scrollback: 0

            });
            term.current.open(terminalRef.current);

            // Initialize WebSocket connection
            ws.current = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);

            ws.current.onopen = () => {
                console.log('Connected to WebSocket server');
            };

            ws.current.onmessage = (event) => {
                const message = JSON.parse(event.data);
                switch (message.type) {
                    case 'output':
                        term.current?.write(message.data);
                        break;
                    case 'exit':
                        term.current?.write(`\r\n${message.data}\r\n`);
                        break;
                    case 'testResults':
                        displayTestResults(message.data);
                        break;
                    default:
                        if (message.error) {
                            term.current?.write(`\r\nError: ${message.error}\r\n`);
                        }
                }
            };

            ws.current.onclose = () => {
                console.log('Disconnected from WebSocket server');
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            // Function to display test results
            const displayTestResults = (results: any[]) => {
                term.current?.write('\r\n\x1b[1;33m========== Test Results ==========\x1b[0m\r\n');
                results.forEach((result, index) => {
                    const status = result.passed ? '\x1b[32mPASSED\x1b[0m' : '\x1b[31mFAILED\x1b[0m';
                    term.current?.write(`\r\nTest Case ${index + 1}: ${status}\r\n`);
                    term.current?.write(`Input: ${result.input}\r\n`);
                    term.current?.write(`Expected Output: ${result.expectedOutput}\r\n`);
                    term.current?.write(`Actual Output: ${result.actualOutput}\r\n`);
                    if (!result.passed) {
                        term.current?.write(`\x1b[31mMismatch between expected and actual output\x1b[0m\r\n`);
                    }
                });
                term.current?.write('\r\n\x1b[1;33m===================================\x1b[0m\r\n');
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

        <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />
    );
};

export default TerminalWindow;