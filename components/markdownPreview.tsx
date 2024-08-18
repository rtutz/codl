import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
    dracula,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface IMarkdownPreview {
    markdownContent: string
}

export default function MarkdownPreview({ markdownContent }: IMarkdownPreview) {
    return (
        <article className="prose prose-invert prose-headings:text-white prose-p:text-white prose-strong:text-white prose-em:text-white prose-code:text-white prose-ul:text-white prose-ol:text-white prose-li:text-white min-w-full p-4">
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
                            <code className="text-white">{children}</code>
                        );
                    },
                }}
            >
                {markdownContent}
            </ReactMarkdown>
        </article>
    )
}