import { createContext, useContext, useState } from "react";

const Context = createContext();

export function LessonIdProvider({ children }) {
    const [lessonId, setLessonId] = useState('Testing');
    return (
      <Context.Provider value={[lessonId, setLessonId]}>{children}</Context.Provider>
    );
  }
  
  export function useLessonIdContext() {
    return useContext(Context);
  }