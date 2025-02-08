export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
  seen?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  conversations: Conversation[];
  currentConversationId: string | null;
  suggestedResponses: string[];
}

export interface ApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

export interface Settings {
  aiPersonality: 'default' | 'professional' | 'friendly' | 'concise';
  responseFormat: 'default' | 'bullet' | 'paragraph' | 'stepByStep';
  codeBlocks: {
    syntax: boolean;
    lineNumbers: boolean;
  };
}