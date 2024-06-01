import { useMarkdown } from "@/providers/markdownProvider"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  dark,
  dracula,
  prism,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function Lecture() {
    const { markdown, setMarkdown } = useMarkdown();

    return (
        <>
            {/* Top nav for buttons */}
            <div className="min-w-full">
                This is space for the nav
            </div>

            {/* Main layout */}
            <div className="h-full flex">
                {/* Editor */}
                <div className="w-1/2 border border-border flex flex-col overflow-x-auto">
                    {/* Header */}
                    <div>Header</div>
                    <textarea
                        className="flex-grow bg-transparent focus:outline-none resize-none w-full p-4"
                        value={markdown.markdown}
                        onChange={(e) => setMarkdown({ markdown: e.target.value })}
                    />
                </div>

                {/* Preview */}
                <div className="w-1/2 border border-border flex flex-col overflow-x-auto">
                    {/* Header */}
                    <div>Preview</div>

                    {/* Content */}
                    <article className="prose prose-headings:text-white prose-p:text-white min-w-full p-4">
                    <ReactMarkdown
                    components={{
                        code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                            style={dracula} 
                            language={match[1]}
                            PreTag="div"
                            {...props}
                            >
                            {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code>{children}</code>
                        );
                        },
                    }}
                    >
                    {markdown.markdown}
                    </ReactMarkdown>
                    </article>
                </div>
            </div>


        </>
    )
}