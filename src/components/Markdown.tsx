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
        pre: ({ className, children, ...props }) => (
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto" {...props}>
            {children}
          </pre>
        ),
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <code className={className} {...props}>
              {children}
            </code>
          ) : (
            <code className="bg-gray-800 px-1 py-0.5 rounded" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;