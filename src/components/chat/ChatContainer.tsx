import { FC, useState, useRef, useEffect } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { useChat } from '../../hooks/useChat';
import { Settings, Trash2 } from 'lucide-react';
import { SettingsDialog } from '../settings/SettingsDialog';

export const ChatContainer: FC = () => {
  const { messages, isLoading, error, sendMessage, clearHistory } = useChat();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    try {
      await sendMessage(text);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-surface/20 text-text-primary animate-gradient">
      <div className="container mx-auto max-w-5xl h-screen p-4 md:p-6">
        <div className="h-full glass-card flex flex-col overflow-hidden relative">
          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
          </div>

          {/* Header */}
          <header className="relative px-6 py-4 border-b border-white/10 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary-light" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">
                    AI Assistant
                  </h1>
                  <p className="text-text-secondary text-sm">Powered by Gemini</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearHistory}
                  className="btn btn-secondary p-2"
                  title="Clear chat history"
                  type="button"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="btn btn-secondary p-2"
                  title="Open settings"
                  type="button"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          <ErrorBoundary>
            <main className="flex-1 overflow-hidden flex flex-col relative">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
                {messages.length === 0 ? (
                  <EmptyState />
                ) : (
                  <MessageList messages={messages} isLoading={isLoading} />
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Error Display */}
              {error && (
                <div className="mx-4 p-4 rounded-lg bg-error/10 border border-error/20 text-error animate-in">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 backdrop-blur-lg">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              </div>
            </main>
          </ErrorBoundary>
        </div>
      </div>

      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};