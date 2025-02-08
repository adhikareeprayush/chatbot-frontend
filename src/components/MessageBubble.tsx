import { FC } from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import Markdown from './Markdown';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={twMerge(
        "flex items-start gap-4 px-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={twMerge(
          "flex items-center justify-center w-10 h-10 rounded-full shrink-0 border",
          isUser 
            ? "bg-blue-500/20 border-blue-500/30" 
            : "bg-gray-700/20 border-gray-700/30"
        )}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div
        className={twMerge(
          "relative px-6 py-4 rounded-2xl max-w-[80%] break-words backdrop-blur-sm",
          isUser 
            ? "bg-blue-500/10 border border-blue-500/20" 
            : "bg-gray-700/10 border border-gray-700/20"
        )}
      >
        <Markdown content={message.text} />
      </div>
    </motion.div>
  );
};