import type { AIConfig, ResumeConfig } from '@/types';

const STORAGE_KEY = 'cvenhancer_config';
const RESUME_CONFIG_KEY = 'cvenhancer_resume_config';

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

export const saveResumeConfig = (config: ResumeConfig): void => {
  try {
    localStorage.setItem(RESUME_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save resume configuration:', error);
  }
};

export const loadResumeConfig = (): ResumeConfig | null => {
  try {
    const stored = localStorage.getItem(RESUME_CONFIG_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load resume configuration:', error);
    return null;
  }
};

export const clearResumeConfig = (): void => {
  try {
    localStorage.removeItem(RESUME_CONFIG_KEY);
  } catch (error) {
    console.error('Failed to clear resume configuration:', error);
  }
};