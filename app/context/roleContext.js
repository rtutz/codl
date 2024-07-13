"use client"

import { createContext, useContext, useState } from "react";

const ClassRoleContext = createContext();

export function ClassRoleProvider({ children }) {
    const [classID, setClassID] = useState('');
    const [role, setRole] = useState('');
    
    const value = {
        classID,
        setClassID,
        role,
        setRole
    };

    return (
        <ClassRoleContext.Provider value={value}>{children}</ClassRoleContext.Provider>
    );
}

export function useClassRole() {
    const context = useContext(ClassRoleContext);
    if (context === undefined) {
        throw new Error('useClassRole must be used within a ClassRoleProvider');
    }
    return context;
}