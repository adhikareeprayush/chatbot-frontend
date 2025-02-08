import { FC } from 'react';
import { Bot } from 'lucide-react';

export const EmptyState: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
      <div className="w-16 h-16 rounded-full bg-gray-700/20 border border-gray-700/30 flex items-center justify-center mb-6">
        <Bot className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold text-gray-300 mb-2">Welcome!</h2>
      <p className="text-sm max-w-md">
        I'm your AI assistant, ready to help with any questions you have. Feel free to start a conversation!
      </p>
    </div>
  );
};