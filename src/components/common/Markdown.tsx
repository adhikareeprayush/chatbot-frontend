import { FC, useState, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// Import specific languages we want to support
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';

// Register languages
const languages = {
  javascript,
  typescript,
  python,
  jsx: javascript,
  tsx: typescript,
  html: xml,
  css,
  json,
  markdown,
  bash,
  shell: bash,
  sql,
};

interface MarkdownProps {
  content: string;
  className?: string;
  isUserMessage?: boolean;
}

interface CopyButtonProps {
  text: string;
  isUserMessage?: boolean;
}

const CopyButton: FC<CopyButtonProps> = ({ text, isUserMessage }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={twMerge(
        "absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100",
        isUserMessage
          ? "hover:bg-sage-700/50 text-sage-100"
          : "hover:bg-sage-200 text-sage-600"
      )}
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
};

export const Markdown: FC<MarkdownProps> = ({ content, className, isUserMessage }) => {
  return (
    <ReactMarkdown
      className={twMerge(
        "prose max-w-none",
        isUserMessage ? "prose-invert" : "prose-sage",
        className
      )}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        [rehypeHighlight, { languages, subset: false }]
      ]}
      components={{
        pre: ({ children, ...props }) => {
          // Extract the code content for the copy button
          let codeContent = '';
          if (children && typeof children === 'object' && 'props' in children) {
            codeContent = children.props?.children || '';
          }

          return (
            <pre
              className={twMerge(
                "p-4 rounded-lg overflow-x-auto my-4 shadow-sm group relative",
                isUserMessage 
                  ? "bg-sage-800/90 border border-sage-700" 
                  : "bg-sage-100 border border-sage-200"
              )}
              {...props}
            >
              <CopyButton text={codeContent} isUserMessage={isUserMessage} />
              {children}
            </pre>
          );
        },
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          const lang = match?.[1] || '';
          const isInline = !match;
          
          return !isInline ? (
            <code
              className={twMerge(
                className,
                "block text-sm font-mono",
                isUserMessage ? "text-white" : "text-sage-900"
              )}
              {...props}
            >
              {lang && (
                <div className={twMerge(
                  "absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded",
                  isUserMessage
                    ? "bg-sage-700/50 text-sage-100"
                    : "bg-sage-200/50 text-sage-700"
                )}>
                  {lang}
                </div>
              )}
              {children}
            </code>
          ) : (
            <code
              className={twMerge(
                "px-1.5 py-0.5 rounded text-sm font-medium font-mono",
                isUserMessage 
                  ? "bg-sage-600/80 text-white" 
                  : "bg-sage-100 text-sage-900"
              )}
              {...props}
            >
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