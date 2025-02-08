import { FC, useState, useRef, useEffect } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { useChat } from '../../hooks/useChat';
import { Settings, LogOut, Menu, X, MessageSquare, Plus } from 'lucide-react';
import { SettingsDialog } from '../settings/SettingsDialog';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatContainerProps {
  onLogout: () => void;
}

export const ChatContainer: FC<ChatContainerProps> = ({ onLogout }) => {
  const { messages, isLoading, error, sendMessage } = useChat();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dummy chat history data
  const chatHistory = [
    { id: 1, title: "Project Discussion", date: "Today", unread: true },
    { id: 2, title: "Technical Support", date: "Today", unread: false },
    { id: 3, title: "Code Review", date: "Yesterday", unread: false },
    { id: 4, title: "Bug Analysis", date: "Yesterday", unread: false },
    { id: 5, title: "Feature Planning", date: "Last Week", unread: false },
  ];

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
    <div className="min-h-screen bg-sage-50 text-sage-900">
      <div className="h-screen flex overflow-hidden">
        {/* Overlay for mobile */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: isSidebarOpen ? '320px' : '0px',
            opacity: isSidebarOpen ? 1 : 0,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300
          }}
          className="h-screen bg-white shadow-lg flex-shrink-0 overflow-hidden relative z-30"
        >
          <div className="w-80 h-full flex flex-col">
            <div className="p-4 border-b border-sage-100 flex items-center justify-between bg-white sticky top-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-sage-600" />
                <h2 className="font-semibold text-sage-800">Chat History</h2>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 hover:bg-sage-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-sage-600" />
              </button>
            </div>
            
            <div className="p-3">
              <button className="w-full flex items-center gap-2 px-4 py-3 bg-sage-50 hover:bg-sage-100 rounded-xl text-sage-700 font-medium transition-colors">
                <Plus className="w-5 h-5" />
                New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  className="w-full p-3 text-left rounded-xl hover:bg-sage-50 transition-all duration-200 group relative"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-sage-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sage-800 truncate">{chat.title}</div>
                      <div className="text-sm text-sage-500">{chat.date}</div>
                    </div>
                    {chat.unread && (
                      <div className="w-2 h-2 rounded-full bg-sage-600 absolute right-3" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
            <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
              <div className="flex items-center gap-3">
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 hover:bg-sage-50 rounded-lg transition-colors"
                  >
                    <Menu className="w-5 h-5 text-sage-600" />
                  </button>
                )}
                <h1 className="text-xl font-semibold text-sage-800">AI Assistant</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 hover:bg-sage-50 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5 text-sage-600" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-sage-50 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5 text-sage-600" />
                </button>
              </div>
            </div>
          </header>

          <ErrorBoundary>
            <main className="flex-1 overflow-hidden flex flex-col relative">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
                <div className="max-w-screen-lg mx-auto">
                  {messages.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <MessageList messages={messages} isLoading={isLoading} />
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mx-auto max-w-screen-lg px-4">
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 animate-in">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-sage-100 bg-white sticky bottom-0">
                <div className="max-w-screen-lg mx-auto">
                  <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
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