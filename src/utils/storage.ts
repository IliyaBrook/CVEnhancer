import type { AIConfig } from '../types';
import { encrypt, decrypt } from './encryption';

const STORAGE_KEY = 'cvenhancer_config';

export const saveConfig = (config: AIConfig): void => {
  try {
    const configToStore = { ...config };
    
    if (configToStore.apiKey) {
      configToStore.apiKey = encrypt(configToStore.apiKey);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configToStore));
  } catch (error) {
    console.error('Failed to save configuration:', error);
  }
};

export const loadConfig = (): AIConfig | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const config: AIConfig = JSON.parse(stored);
    
    if (config.apiKey) {
      try {
        config.apiKey = decrypt(config.apiKey);
      } catch (error) {
        console.error('Failed to decrypt API key:', error);
        config.apiKey = undefined;
      }
    }
    
    return config;
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