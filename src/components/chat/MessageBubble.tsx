import { FC, memo, useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Message } from '../../types';
import { Markdown } from '../common/Markdown';
import { Avatar } from '../common/Avatar';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: FC<MessageBubbleProps> = memo(({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={twMerge(
        "flex items-start gap-4 px-4 group",
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
            ? "bg-sage-600 text-white" 
            : "bg-white text-sage-800"
        )}
      >
        <div className={isUser ? "text-white" : "text-sage-800"}>
          <Markdown content={message.text} isUserMessage={isUser} />
        </div>
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
      </div>
    </motion.div>
  );
});

MessageBubble.displayName = 'MessageBubble';