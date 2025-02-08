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
          isUser ? "bg-primary/20 border-primary/30" : "bg-surface/50 border-white/20"
        )}
      />
      <div
        className={twMerge(
          "relative px-6 py-4 rounded-2xl max-w-[80%] break-words transition-all duration-300",
          isUser 
            ? "bg-primary/10 border border-primary/20 hover:bg-primary/15" 
            : "glass-effect hover:bg-surface/50"
        )}
      >
        <Markdown content={message.text} />
        <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <time className="text-xs text-text-secondary">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </time>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="p-1 rounded-lg hover:bg-surface/50 transition-colors"
              title={copied ? "Copied!" : "Copy message"}
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4 text-text-secondary" />
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

MessageBubble.displayName = 'MessageBubble';