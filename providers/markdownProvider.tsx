"use client"

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface IMarkdownContext {
  markdown: string;
  setMarkdown: Dispatch<SetStateAction<string>>;
}

const MarkdownContext = createContext<IMarkdownContext | undefined>(undefined);

const MarkdownProvider = ({ children }: { children: ReactNode }) => {
  const [markdown, setMarkdown] = useState<string>('');

  return (
    <MarkdownContext.Provider value={{ markdown, setMarkdown }}>
      {children}
    </MarkdownContext.Provider>
  );
};

export const useMarkdown = (): IMarkdownContext => {
  const context = useContext(MarkdownContext);
  if (context === undefined) {
    throw new Error('useMarkdown must be used within a MarkdownProvider');
  }
  return context;
};

export default MarkdownProvider;