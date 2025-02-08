export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
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