import type { AIConfig, ResumeConfig } from '@/types';

const STORAGE_KEY = 'cvenhancer_config';
const RESUME_CONFIG_KEY = 'cvenhancer_resume_config';
const JOB_TITLE_KEY = 'cvenhancer_job_title';

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

    const config = JSON.parse(stored);

    // Migration: Convert old apiKey format to new apiKeys format
    if (config.apiKey && !config.apiKeys) {
      const provider = config.provider;
      const apiKeys: any = {};

      // Map old apiKey to appropriate provider
      if (provider === 'openai' || provider === 'chatgpt') {
        apiKeys.openai = config.apiKey;
      } else if (provider === 'claude') {
        apiKeys.claude = config.apiKey;
      }

      // Update config with new structure
      config.apiKeys = apiKeys;
      delete config.apiKey;

      // Migrate chatgpt to openai
      if (config.provider === 'chatgpt') {
        config.provider = 'openai';
      }

      // Save migrated config
      saveConfig(config);
      console.log('Migrated old apiKey format to new apiKeys format');
    }

    // Migration: Convert old model format to new models format
    if (config.model && !config.models) {
      const provider = config.provider;
      const models: any = {};

      // Map old model to appropriate provider
      if (provider === 'openai' || provider === 'chatgpt') {
        models.openai = config.model;
      } else if (provider === 'claude') {
        models.claude = config.model;
      } else if (provider === 'ollama') {
        models.ollama = config.model;
      }

      // Update config with new structure
      config.models = models;
      delete config.model;

      // Save migrated config
      saveConfig(config);
      console.log('Migrated old model format to new models format');
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

export const saveJobTitle = (jobTitle: string): void => {
  try {
    localStorage.setItem(JOB_TITLE_KEY, jobTitle);
  } catch (error) {
    console.error('Failed to save job title:', error);
  }
};

export const loadJobTitle = (): string => {
  try {
    const stored = localStorage.getItem(JOB_TITLE_KEY);
    return stored || '';
  } catch (error) {
    console.error('Failed to load job title:', error);
    return '';
  }
};