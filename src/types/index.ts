export interface User {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  chatHistory: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
  seen?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  suggestedResponses: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Settings {
  aiPersonality: 'default' | 'professional' | 'friendly' | 'concise';
  responseFormat: 'default' | 'bullet' | 'paragraph' | 'stepByStep';
  codeBlocks: {
    syntax: boolean;
    lineNumbers: boolean;
  };
}

export interface ApiResponse {
  success: boolean;
  data: any;
  message: string;
}