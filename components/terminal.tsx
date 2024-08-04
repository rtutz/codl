"use client";

import { Terminal } from '@xterm/xterm';
import { useRef, useEffect, RefObject } from 'react';
import 'xterm/css/xterm.css';

interface ITerminalWindow {
    terminalData: string;
    terminalRef: RefObject<HTMLDivElement>;
}

const TerminalWindow: React.FC<ITerminalWindow> = ({ terminalRef, terminalData }) => {
    const term = useRef<Terminal | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const inputBuffer = useRef<string>('');

    console.log("terminal ref is", terminalRef);
    console.log("term is", term);

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
        if (term.current) {
            term.current.write(data); // Echo the input to the terminal

            if (data === '\r') { // Enter key pressed
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ type: 'command', data: inputBuffer.current }));
                    inputBuffer.current = ''; // Clear the buffer
                }
            } else if (data === '\u007F') { // Handle backspace
                if (inputBuffer.current.length > 0) {
                    inputBuffer.current = inputBuffer.current.slice(0, -1);
                    term.current.write('\b \b'); // Erase the last character from the terminal
                }
            } else {
                inputBuffer.current += data; // Append data to buffer
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