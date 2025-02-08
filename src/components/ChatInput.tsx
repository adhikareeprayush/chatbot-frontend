import { FC, FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export const ChatInput: FC<ChatInputProps> = ({
  prompt,
  setPrompt,
  onSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-gray-700/20 border border-gray-600/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-400 transition-all duration-200"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="bg-blue-500/80 hover:bg-blue-500 disabled:bg-gray-600/50 disabled:cursor-not-allowed px-6 py-3 rounded-xl transition-colors duration-200 flex items-center gap-2 backdrop-blur-sm"
      >
        <Send className="w-5 h-5" />
        <span className="hidden sm:inline">Send</span>
      </button>
    </form>
  );
};