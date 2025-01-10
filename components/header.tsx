"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";


interface IHeader {
    updateCurrentView: (view: string) => void
}

export default function Header({ updateCurrentView }: IHeader) {
    const [activeView, setActiveView] = useState('lesson');
    const { data: session, status } = useSession();

    const handleNavClick = (view: string) => {
        setActiveView(view);
        updateCurrentView(view);
    };

    return (
        <header className="flex justify-between items-center p-4 border bg-card">
            <div className="logo text-2xl font-bold">Codl</div>
            <div className="flex items-center space-x-6">
                <nav>
                    <ul className="flex space-x-4">
                        {['lesson', 'coding', 'quiz'].map((view) => (
                            <li key={view}>
                                <button
                                    onClick={() => handleNavClick(view)}
                                    className={`px-3 py-2 rounded-md transition-colors ${activeView === view
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {view}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                {status !== "authenticated" ? (
                    <Button
                        onClick={() => signIn()}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Login
                    </Button>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <img
                                src={session.user.image || "https://github.com/shadcn.png"}
                                alt="User Profile"
                                className="w-10 h-10 rounded-full cursor-pointer"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => signOut()}>
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}