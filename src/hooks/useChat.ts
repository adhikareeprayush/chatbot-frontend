import { useCallback, useRef, useState } from 'react';
import { Message, ChatState, ApiResponse } from '../types';
import { useSettings } from './useSettings';
import { formatPrompt, cleanResponse } from './promptEngineering';

const generateMessageId = () => `${Date.now()}-${Math.random().toString(36).substring(7)}`;

const MAX_CONTEXT_MESSAGES = 10;
const TYPING_SPEED = { min: 15, max: 35 }; // Variable typing speed

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  isTyping: false,
  conversations: [],
  currentConversationId: null,
  suggestedResponses: [],
};

export const useChat = () => {
  const { settings } = useSettings();
  const [state, setState] = useState<ChatState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isLoading: false,
      isTyping: false,
      messages: prev.messages.map(msg => 
        msg.isStreaming ? { ...msg, isStreaming: false } : msg
      ),
    }));
  }, []);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot', stream = false) => {
    const message = {
      id: generateMessageId(),
      text: stream ? '' : text,
      sender,
      timestamp: new Date(),
      isStreaming: stream,
      seen: sender === 'user',
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
      suggestedResponses: [],
      isLoading: sender === 'bot' ? true : prev.isLoading,
    }));

    return message.id;
  }, []);

  const updateMessage = useCallback((id: string, text: string, isStreaming = true) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.map((msg) =>
        msg.id === id ? { ...msg, text, isStreaming } : msg
      ),
      isLoading: isStreaming,
    }));
  }, []);

  const simulateTyping = useCallback((text: string, messageId: string) => {
    let currentIndex = 0;
    setState(prev => ({ ...prev, isTyping: true, isLoading: true }));

    const getRandomTypingSpeed = () => {
      const nextChar = text[currentIndex];
      if (['.', '!', '?', '\n'].includes(nextChar)) {
        return TYPING_SPEED.max * 2;
      }
      return Math.random() * (TYPING_SPEED.max - TYPING_SPEED.min) + TYPING_SPEED.min;
    };

    const typeNextChar = () => {
      if (currentIndex <= text.length) {
        const currentText = text.slice(0, currentIndex);
        updateMessage(messageId, currentText, true);
        currentIndex++;
        
        if (currentIndex <= text.length) {
          typingTimeoutRef.current = setTimeout(typeNextChar, getRandomTypingSpeed());
        } else {
          setState(prev => ({ 
            ...prev, 
            isTyping: false,
            isLoading: false,
            messages: prev.messages.map(msg => 
              msg.id === messageId ? { ...msg, isStreaming: false } : msg
            ),
            suggestedResponses: generateSuggestedResponses(text)
          }));
        }
      }
    };

    typeNextChar();
  }, [updateMessage]);

  const generateSuggestedResponses = (text: string): string[] => {
    const suggestions: string[] = [];
    const lowercaseText = text.toLowerCase();
    
    // Technical questions
    if (lowercaseText.includes('error') || lowercaseText.includes('bug') || lowercaseText.includes('issue')) {
      suggestions.push('Can you share the error message or stack trace?');
      suggestions.push('What steps can reproduce this issue?');
      suggestions.push('What have you tried so far to fix it?');
    }

    // Code-related questions
    if (lowercaseText.includes('code') || lowercaseText.includes('function') || lowercaseText.includes('programming')) {
      suggestions.push('Would you like to see a code example?');
      suggestions.push('What programming language are you using?');
      suggestions.push('Are you following any specific coding standards?');
    }

    // Explanation requests
    if (lowercaseText.includes('explain') || lowercaseText.includes('how') || lowercaseText.includes('what')) {
      suggestions.push('Would you like a more detailed explanation?');
      suggestions.push('Should I break this down step by step?');
      suggestions.push('Would you like to see some practical examples?');
    }

    // Implementation questions
    if (lowercaseText.includes('implement') || lowercaseText.includes('create') || lowercaseText.includes('build')) {
      suggestions.push('What are the specific requirements?');
      suggestions.push('Are there any performance constraints?');
      suggestions.push('Would you like to see alternative approaches?');
    }

    // Best practices
    if (lowercaseText.includes('best') || lowercaseText.includes('practice') || lowercaseText.includes('recommend')) {
      suggestions.push('Are you working on a specific use case?');
      suggestions.push("What is your current approach?");
      suggestions.push('Would you like to know about common pitfalls?');
    }

    // Comparison questions
    if (lowercaseText.includes('vs') || lowercaseText.includes('versus') || lowercaseText.includes('compare')) {
      suggestions.push('What specific aspects would you like to compare?');
      suggestions.push('Are you considering these for a particular project?');
      suggestions.push('Would you like to see a detailed comparison?');
    }

    // If no specific category is matched, provide general follow-ups
    if (suggestions.length === 0) {
      suggestions.push('Could you provide more details?');
      suggestions.push('What specific aspect interests you most?');
      suggestions.push('Would you like me to elaborate on any point?');
    }

    // Return 3 random suggestions
    return suggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  };

  const markMessageAsSeen = useCallback((messageId: string) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.map((msg) =>
        msg.id === messageId ? { ...msg, seen: true } : msg
      ),
    }));
  }, []);

  const createNewConversation = useCallback(() => {
    const conversationId = generateMessageId();
    setState((prev) => ({
      ...prev,
      conversations: [
        ...prev.conversations,
        { id: conversationId, title: 'New Chat', messages: [] }
      ],
      currentConversationId: conversationId,
    }));
    return conversationId;
  }, []);

  const buildContextPrompt = (newPrompt: string, messages: Message[]) => {
    const contextMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
    const context = contextMessages
      .map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`)
      .join('\n\n');
    return context ? `${context}\n\nUSER: ${newPrompt}` : newPrompt;
  };

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || state.isLoading) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setState(prev => ({
        ...prev,
        error: 'API key is missing',
      }));
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      addMessage(prompt, 'user');

      const contextPrompt = buildContextPrompt(prompt, state.messages);
      const engineeredPrompt = formatPrompt(contextPrompt, settings);
      const botMessageId = addMessage('', 'bot', true);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: engineeredPrompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data: ApiResponse = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format');
      }

      const rawResponse = data.candidates[0].content.parts[0].text.trim();
      const cleanedResponse = cleanResponse(rawResponse);
      
      // Simulate typing effect for the response
      simulateTyping(cleanedResponse, botMessageId);

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Chat error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message',
      }));
    } finally {
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [addMessage, settings, state.messages, simulateTyping]);

  const clearHistory = useCallback(() => {
    setState(initialState);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  return {
    ...state,
    sendMessage,
    clearHistory,
    createNewConversation,
    markMessageAsSeen,
    stopGeneration,
  };
};