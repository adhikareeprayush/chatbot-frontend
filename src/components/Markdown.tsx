import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownProps {
  content: string;
}

export const Markdown: FC<MarkdownProps> = ({ content }) => {
  return (
    <ReactMarkdown
      className="prose prose-invert max-w-none"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        pre: ({ node, ...props }) => (
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto" {...props} />
        ),
        code: ({ node, inline, ...props }) =>
          inline ? (
            <code className="bg-gray-800 px-1 py-0.5 rounded" {...props} />
          ) : (
            <code {...props} />
          ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;