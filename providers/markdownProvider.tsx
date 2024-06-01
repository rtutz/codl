"use client"

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';


interface IMarkdown {
    markdown: string;
}

interface IMarkdownContext {
    markdown: IMarkdown;
    setMarkdown: Dispatch<SetStateAction<IMarkdown>>;
  }

  const MarkdownContext = createContext<IMarkdownContext | undefined>(undefined);

const MarkdownProvider = ({ children} : {children: ReactNode}) => {
  const [markdown, setMarkdown] = useState<IMarkdown>({markdown: ''});

  return (
    <MarkdownContext.Provider value={{ markdown, setMarkdown }}>
        { children }
    </MarkdownContext.Provider>
  );
};

export const useMarkdown = () => useContext(MarkdownContext);

export default MarkdownProvider;