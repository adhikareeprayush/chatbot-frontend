import { FC, FormEvent, useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onStopGeneration: () => void;
  isLoading: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({ onSendMessage, onStopGeneration, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!message.trim() || isLoading) return;

    const currentMessage = message;
    setMessage('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await onSendMessage(currentMessage);
    } catch (error) {
      setMessage(currentMessage);
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative group"
      autoComplete="off"
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="w-full resize-none rounded-xl border border-sage-200 px-4 py-3 pr-[4.5rem] focus:ring-2 focus:ring-sage-500 focus:border-transparent max-h-32 min-h-[52px] bg-white text-sage-800 placeholder-sage-400"
        disabled={isLoading}
        rows={1}
        autoFocus
        name="message"
      />
      <motion.button
        type="submit"
        disabled={isLoading ? false : !message.trim()}
        onClick={isLoading ? onStopGeneration : undefined}
        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-sage-600 text-white rounded-lg font-medium hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 min-w-[60px] justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? (
          <>
            <Square className="w-4 h-4" />
            <span className="text-sm">Stop</span>
          </>
        ) : (
          <Send className="w-4 h-4" />
        )}
      </motion.button>
    </form>
  );
};