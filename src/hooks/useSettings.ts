import { useLocalStorage } from './useLocalStorage';
import { Settings } from '../types';

const defaultSettings: Settings = {
  aiPersonality: 'default',
  responseFormat: 'default',
  codeBlocks: {
    syntax: true,
    lineNumbers: false,
  },
};

export const useSettings = () => {
  const [settings, setSettings] = useLocalStorage<Settings>('chat-settings', defaultSettings);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return {
    settings,
    updateSettings,
  };
};