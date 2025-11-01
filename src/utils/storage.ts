import type { AIConfig } from '@/types';

const STORAGE_KEY = 'cvenhancer_config';

export const saveConfig = (config: AIConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save configuration:', error);
  }
};

export const loadConfig = (): AIConfig | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load configuration:', error);
    return null;
  }
};

export const clearConfig = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear configuration:', error);
  }
};