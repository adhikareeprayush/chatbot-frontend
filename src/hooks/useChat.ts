import { useCallback, useRef, useState } from 'react';
import { Message, ChatState, ApiResponse } from '../types';
import { useSettings } from './useSettings';
import { formatPrompt, cleanResponse } from './promptEngineering';

const generateMessageId = () => `${Date.now()}-${Math.random().toString(36).substring(7)}`;

const MAX_CONTEXT_MESSAGES = 10;

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

export const useChat = () => {
  const { settings } = useSettings();
  const [state, setState] = useState<ChatState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: generateMessageId(),
          text,
          sender,
          timestamp: new Date(),
        },
      ],
    }));
  }, []);

  const buildContextPrompt = (newPrompt: string, messages: Message[]) => {
    const contextMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
    const context = contextMessages
      .map(msg => `${msg.text}`)
      .join('\n\n');
    return context ? `${context}\n\n${newPrompt}` : newPrompt;
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

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      addMessage(prompt, 'user');

      const contextPrompt = buildContextPrompt(prompt, state.messages);
      const engineeredPrompt = formatPrompt(contextPrompt, settings);

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
      addMessage(cleanedResponse, 'bot');
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
  }, [addMessage, settings, state.messages]);

  const clearHistory = useCallback(() => {
    setState(initialState);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    clearHistory,
  };
};