"use client"

import Lecture from "@/components/lecture"
import MarkdownProvider from "@/providers/markdownProvider"

export default function lesson() {
    return (
        <div className="flex min-h-screen">
            {/* Side Nav */}
            <div className="border border-border min-h-full" style={{width: '6%'}}>
                testing
            </div>
            
            <div className="flex-grow min-h-screen">
                <MarkdownProvider>
                    <Lecture/>
                </MarkdownProvider>
            </div>
            
        </div>
    )
}