import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { twMerge } from 'tailwind-merge';

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown: FC<MarkdownProps> = ({ content, className }) => {
  return (
    <ReactMarkdown
      className={twMerge("prose prose-invert max-w-none", className)}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        pre: ({ node, className, children, ...props }) => (
          <pre className="bg-surface/50 p-4 rounded-lg overflow-x-auto my-2" {...props}>
            {children}
          </pre>
        ),
        code: ({ node, inline, className, children, ...props }) =>
          inline ? (
            <code className="bg-surface/50 px-1.5 py-0.5 rounded text-primary-light" {...props}>
              {children}
            </code>
          ) : (
            <code {...props}>{children}</code>
          ),
        a: ({ node, className, children, ...props }) => (
          <a
            className="text-primary-light hover:text-primary transition-colors"
            {...props}
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};