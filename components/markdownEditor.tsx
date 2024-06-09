interface IMarkdownEditor {
  markdown: string | undefined;
  setMarkdown: (newMarkdown: { markdown: string }) => void;
}

export default function MarkdownEditor({ markdown, setMarkdown }: IMarkdownEditor) {
  return (
    <textarea
      className="flex-grow bg-transparent focus:outline-none resize-none w-full p-4"
      value={markdown}
      onChange={(e) => setMarkdown({ markdown: e.target.value })}
    />
  );
}