interface IMarkdownEditor {
  markdown: string | undefined;
  setMarkdown: (arg0: string) => void;
}

export default function MarkdownEditor({ markdown, setMarkdown }: IMarkdownEditor) {
  return (
    <textarea
      className="flex-grow bg-transparent focus:outline-none resize-none w-full p-4 min-h-full"
      value={markdown}
      onChange={(e) => setMarkdown(e.target.value)}
    />
  );
}