import { FC, memo, useRef, useEffect, useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Message } from '../../types';
import { Avatar } from '../common/Avatar';
import { Markdown } from '../common/Markdown';

interface MessageBubbleProps {
  message: Message;
  onSeen?: (messageId: string) => void;
}

export const MessageBubble: FC<MessageBubbleProps> = memo(({ message, onSeen }) => {
  const [copied, setCopied] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const isUser = message.sender === 'user';

  useEffect(() => {
    if (!message.seen && !isUser && messageRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onSeen?.(message.id);
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(messageRef.current);
      return () => observer.disconnect();
    }
  }, [message.id, message.seen, isUser, onSeen]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      ref={messageRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={twMerge(
        "flex items-start gap-4 px-4 group relative",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar
        icon={isUser ? User : Bot}
        className={twMerge(
          "transition-transform duration-300 group-hover:scale-110",
          isUser ? "bg-sage-600 text-white border-sage-700" : "bg-sage-100 text-sage-600 border-sage-200"
        )}
      />
      <div
        className={twMerge(
          "relative px-6 py-4 rounded-2xl max-w-[80%] break-words transition-all duration-300",
          isUser 
            ? "bg-sage-600 text-white [&_strong]:text-white [&_strong]:font-bold" 
            : "bg-white text-sage-800 [&_strong]:text-sage-900 [&_strong]:font-bold",
          message.isStreaming && "animate-pulse"
        )}
      >
        <div className={isUser ? "text-white" : "text-sage-800"}>
          <Markdown content={message.text || ' '} isUserMessage={isUser} />
        </div>

        {/* Message metadata and actions */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <time className={`text-xs ${isUser ? 'text-sage-100' : 'text-sage-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </time>
          {!isUser && (
            <button
              onClick={handleCopy}
              className={`p-1 rounded-lg transition-colors ${
                isUser 
                  ? 'hover:bg-sage-500/50' 
                  : 'hover:bg-sage-100'
              }`}
              title={copied ? "Copied!" : "Copy message"}
            >
              {copied ? (
                <Check className={`w-4 h-4 ${isUser ? 'text-sage-100' : 'text-sage-600'}`} />
              ) : (
                <Copy className={`w-4 h-4 ${isUser ? 'text-sage-100' : 'text-sage-400'}`} />
              )}
            </button>
          )}
        </div>

        {/* Read indicator */}
        {isUser && message.seen && (
          <div className="absolute -bottom-6 right-0 text-xs text-sage-400">
            Seen
          </div>
        )}

        {/* Typing indicator */}
        {message.isStreaming && (
          <div className="flex gap-1 mt-2">
            <span className="w-2 h-2 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-sage-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </motion.div>
  );
});

MessageBubble.displayName = 'MessageBubble';