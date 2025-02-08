import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { twMerge } from 'tailwind-merge';

interface MarkdownProps {
  content: string;
  className?: string;
  isUserMessage?: boolean;
}

export const Markdown: FC<MarkdownProps> = ({ content, className, isUserMessage }) => {
  return (
    <ReactMarkdown
      className={twMerge(
        "prose max-w-none",
        isUserMessage ? "prose-invert" : "prose-sage",
        className
      )}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={{
        pre: ({ className, children, ...props }) => (
          <pre className={twMerge(
            "p-4 rounded-lg overflow-x-auto my-2",
            isUserMessage ? "bg-sage-500/50" : "bg-sage-50"
          )} {...props}>
            {children}
          </pre>
        ),
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <code className={twMerge(className, isUserMessage ? "text-white" : "text-sage-800")} {...props}>
              {children}
            </code>
          ) : (
            <code className={twMerge(
              "px-1.5 py-0.5 rounded",
              isUserMessage 
                ? "bg-sage-500/50 text-white" 
                : "bg-sage-100 text-sage-700"
            )} {...props}>
              {children}
            </code>
          );
        },
        p: ({ children }) => (
          <p className={isUserMessage ? "text-white" : "text-sage-800"}>
            {children}
          </p>
        ),
        a: ({ className, children, ...props }) => (
          <a
            className={twMerge(
              "transition-colors",
              isUserMessage 
                ? "text-white hover:text-sage-100" 
                : "text-sage-600 hover:text-sage-700"
            )}
            {...props}
          >
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className={isUserMessage ? "text-white" : "text-sage-800"}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className={isUserMessage ? "text-white" : "text-sage-800"}>
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className={isUserMessage ? "text-white" : "text-sage-800"}>
            {children}
          </li>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};