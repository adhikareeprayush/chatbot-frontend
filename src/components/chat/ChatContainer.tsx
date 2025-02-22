import { FC, useState, useRef, useEffect } from 'react';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { EmptyState } from './EmptyState';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { useChat } from '../../hooks/useChat';
import { Settings, LogOut, Menu, X, MessageSquare, Plus } from 'lucide-react';
import { SettingsDialog } from '../settings/SettingsDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { startChat } from '../../utils/api';
interface ChatContainerProps {
  onLogout: () => void;
}

export const ChatContainer: FC<ChatContainerProps> = ({ onLogout }) => {
  const { messages, isLoading, error, sendMessage, suggestedResponses, stopGeneration, getHistories, getHistory } = useChat();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  interface ChatHistory {
    id: string;
    title: string;
    date: string;
  }
  
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const hasStartedChat = useRef(false); // Track if startChat was called
  const [currentSession, setCurrentSession] = useState('');
  const { user, checkAuth} = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const authenticateAndStartChat = async () => {
      await checkAuth();
      if (user?._id && !hasStartedChat.current) {
        hasStartedChat.current = true;
        try {
          const response = await startChat(user._id);
          setCurrentSession(response.data.sessionId);
          updateChatTitle();
        } catch (err) {
          console.error('Failed to start chat:', err);
        }
      }
    };
    authenticateAndStartChat();
  }, [user]);
  

  // Scroll to bottom when new messages are added or during streaming
  useEffect(() => {
    if (messagesEndRef.current) {
      const messageList = messageListRef.current;
      if (messageList) {
        const isAtBottom = messageList.scrollHeight - messageList.scrollTop <= messageList.clientHeight + 100;
        if (isAtBottom || isLoading) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [messages, isLoading]);

  // Enable scrolling during streaming
  useEffect(() => {
    const messageList = messageListRef.current;
    if (messageList) {
      messageList.style.overflowY = 'auto';
    }
  }, [isLoading]);

  const handleNewChat = async () => {
    if (!user?._id) return; // Ensure user is authenticated
  
    try {
      const response = await startChat(user._id);
      const newSessionId = response.data.sessionId;
      console.log("New Chat Session ID:", newSessionId);
  
      setCurrentSession(newSessionId);
      messages.splice(0, messages.length); // Clear messages
  
      // Wait for AI to generate the summary before adding to sidebar
      await updateChatTitle(); 
    } catch (err) {
      console.error("Error starting new chat:", err);
    }
  };
  
  const updateChatTitle = async () => {
    if (!user?._id) return;
    try {
      const histories = await getHistories(user._id);
      if (histories.success) {
        const sessionIds = histories.data;
        const chatsSummaries = await Promise.all(
          sessionIds.map((sessionId: string) => getHistory(user._id, sessionId))
        );

        const formattedChatHistories = chatsSummaries.map((chat, index) => ({
          id: sessionIds[index],
          title: chat.data[0]?.summary || 'Untitled Chat',
          date: new Date().toISOString(),
        }));

        setChatHistories(() => {
          const newChat = {
            id: currentSession,
            title: messages[0]?.text || 'New Chat',
            date: new Date().toISOString(),
          };
          const mergedChats = [newChat, ...formattedChatHistories].filter(
            (chat, index, self) => index === self.findIndex((c) => c.id === chat.id)
          );
          return mergedChats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
      }
    } catch (err) {
      console.error('Error fetching chat histories:', err);
    }
  };

  useEffect(() => {
    if (currentSession && user?._id) {
      // Fetch messages for the selected session when the currentSession changes
      const fetchMessages = async () => {
        try {
          // Fetch messages using the current session ID
          const fetchedMessages = await getHistory(user._id, currentSession);
          // You can now set these messages in your state (for example: setMessages(fetchedMessages))
          console.log("Fetched Messages:", fetchedMessages);

          if (fetchedMessages?.data?.length) {
            // Format the messages, pairing prompt and response as separate messages
            const formattedMessages = fetchedMessages.data.flatMap((msg: any) => [
              {
                id: `${msg._id}-prompt`, // Create unique ID for prompt
                sender: 'user', // Sender is user for prompt
                text: msg.prompt || '', // Use the prompt as user message
                timestamp: new Date(msg.createdAt), // Convert createdAt to timestamp
                isStreaming: false, // Set streaming as false by default
                seen: false, // Set seen status
              },
              {
                id: `${msg._id}-response`, // Create unique ID for response
                sender: 'bot', // Sender is bot for response
                text: msg.response || '', // Use the response as bot message
                timestamp: new Date(msg.updatedAt), // Use updatedAt as timestamp
                isStreaming: false, // Set streaming as false by default
                seen: false, // Set seen status
              }
            ]);

          console.log("Formatted Messages:", formattedMessages);
          
          messages.splice(0, messages.length, ...formattedMessages);

        } }
        catch (err) {
          console.error('Error fetching messages:', err);
        }
      };
  
      fetchMessages();
    }
  }, [currentSession, user?._id]);
  

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !user?._id || !currentSession) return;
    await sendMessage(message, user._id, currentSession);
    updateChatTitle();
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
              <button className="w-full flex items-center gap-2 px-4 py-3 bg-sage-50 hover:bg-sage-100 rounded-xl text-sage-700 font-medium transition-colors"
                onClick={handleNewChat}
              >
                <Plus className="w-5 h-5" />
                New Chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatHistories
              .filter((chat) => chat.title !== 'New Chat') // Exclude "New Chat" entries
              .map((chat) => (
                <button
                  key={chat.id}
                  className={`w-full p-3 text-left rounded-xl transition-all duration-200 group relative ${
                    currentSession === chat.id ? "bg-sage-100" : "hover:bg-sage-50"
                  }`}
                  onClick={() => setCurrentSession(chat.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-sage-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sage-800 truncate">{chat.title}</div>
                      <div className="text-sm text-sage-500">{chat.date}</div>
                    </div>
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
              <div 
                ref={messageListRef}
                className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
              >
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
                <div className="mx-auto max-w-screen-lg px-4 mb-4">
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 animate-in">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-sage-100 bg-white sticky bottom-0">
                <div className="max-w-screen-lg mx-auto space-y-3">
                  {suggestedResponses.length > 0 && !isLoading && (
                    <div className="flex flex-wrap gap-2">
                      {suggestedResponses.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => user?._id && sendMessage(suggestion, user._id, currentSession)}
                          className="px-4 py-2 bg-sage-50 hover:bg-sage-100 text-sage-700 rounded-full text-sm transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <ChatInput 
                    onSendMessage={handleSendMessage}
                    userId={user?._id || ''}
                    sessionId={currentSession}
                    placeholder={`Type a message ${user?.fullname}`}
                    onStopGeneration={stopGeneration}
                    isLoading={isLoading} 
                  />
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