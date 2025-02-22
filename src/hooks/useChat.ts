import { useState, useCallback, useRef } from 'react';
import { Message, ChatState } from '../types';
import { getChatHistory, sendChatMessage, getChatHistories } from '../utils/api';
import { useSettings } from './useSettings';
import { getErrorMessage } from '../utils/errorMessages';

const TYPING_SPEED = 25; // ms per character

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    isTyping: false,
    suggestedResponses: [],
  });

  const { settings } = useSettings();
  const abortControllerRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot', isStreaming = false) => {
    const messageId = Math.random().toString(36).substring(7);
    const message: Message = {
      id: messageId,
      sender,
      text,
      timestamp: new Date(),
      isStreaming,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));

    return messageId;
  }, []);

  const startChat = useCallback(async (userId: string) => {
    try {
      const response = await startChat(userId);
      console.log("Response from startChat: ", response)
    } catch (error) {
      console.error("Error in startChat: ", error)
    }
  }, []);

  const updateMessage = useCallback((id: string, text: string, isStreaming = false) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(message =>
        message.id === id ? { ...message, text, isStreaming } : message
      ),
    }));
  }, []);

  const simulateTyping = useCallback(async (text: string, messageId: string) => {
    let currentText = '';
    const chars = text.split('');

    for (const char of chars) {
      if (abortControllerRef.current?.signal.aborted) {
        break;
      }

      currentText += char;
      updateMessage(messageId, currentText, true);
      await new Promise(resolve => setTimeout(resolve, TYPING_SPEED));
    }

    updateMessage(messageId, currentText, false);
  }, [updateMessage]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({
        ...prev,
        isLoading: false,
        messages: prev.messages.map(message =>
          message.isStreaming ? { ...message, isStreaming: false } : message
        ),
      }));
    }
  }, []);

  const getHistory = useCallback(async (userId: string, sessionId: string) => {
    try{
        const response = await getChatHistory(userId, sessionId);
        return response;

    } catch{
      throw new Error('Failed to getHistory');
    }
  }, []);

  const getHistories = useCallback(async (userId: string): Promise<any> => {
    try{
      const response = await getChatHistories(userId);
      return response;
    }
    catch{
      throw new Error('Failed to getHistories');
    }
  }, []);

  const sendMessage = useCallback(async (prompt: string, userId: string, sessionId: string) => {
    if (!prompt.trim() || state.isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      addMessage(prompt, 'user');

      const botMessageId = addMessage('', 'bot', true);

      const response = await sendChatMessage(prompt, userId, sessionId); // Replace with actual user ID from auth
      const responseText = response.data.response;

      await simulateTyping(responseText, botMessageId);

      // Generate suggested responses based on context
      const suggestedResponses = [
        'Tell me more about that',
        'Can you explain further?',
        'What are the next steps?',
      ];

      setState(prev => ({ ...prev, suggestedResponses }));

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Chat error:', error);
      setState(prev => ({
        ...prev,
        error: getErrorMessage(error),
      }));
    } finally {
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [addMessage, settings, state.messages, simulateTyping]);

  return {
    ...state,
    sendMessage,
    startChat,
    getHistory,
    getHistories,
    stopGeneration,
  };
};