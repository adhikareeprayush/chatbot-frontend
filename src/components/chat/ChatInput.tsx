import { FC, FormEvent, useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
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
    e.stopPropagation(); // Prevent event bubbling
    
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
      e.stopPropagation(); // Prevent event bubbling
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
        className="input w-full resize-none max-h-32 pr-24 min-h-[52px]"
        disabled={isLoading}
        rows={1}
        autoFocus
        name="message"
      />
      <motion.button
        type="submit"
        disabled={isLoading || !message.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary py-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </motion.button>
    </form>
  );
};