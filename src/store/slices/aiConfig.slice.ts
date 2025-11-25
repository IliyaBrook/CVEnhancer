import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AIConfig, AIProvider } from '@/types';
import { AIProvider as AIProviderEnum } from '@/types';

export interface AIConfigState {
  config: AIConfig | null;
  provider: AIProvider;
  apiKeys: {
    openai?: string;
    claude?: string;
  };
  models: {
    openai?: string;
    claude?: string;
    ollama?: string;
  };
  ollamaEndpoint: string;
  isSettingsModalOpen: boolean;
}

const initialState: AIConfigState = {
  config: null,
  provider: AIProviderEnum.OPENAI,
  apiKeys: {},
  models: {},
  ollamaEndpoint: 'http://localhost:11434',
  isSettingsModalOpen: false,
};

export const aiConfigSlice = createSlice({
  name: 'aiConfig',
  initialState,
  reducers: {
    setProvider: (state, action: PayloadAction<AIProvider>) => {
      state.provider = action.payload;
    },
    
    setApiKey: (state, action: PayloadAction<{ provider: 'openai' | 'claude'; key: string }>) => {
      state.apiKeys[action.payload.provider] = action.payload.key;
    },
    
    setModel: (state, action: PayloadAction<{ provider: 'openai' | 'claude' | 'ollama'; model: string }>) => {
      state.models[action.payload.provider] = action.payload.model;
    },
    
    setOllamaEndpoint: (state, action: PayloadAction<string>) => {
      state.ollamaEndpoint = action.payload;
    },
    
    setIsSettingsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsModalOpen = action.payload;
    },
  },
});

export const {
  setProvider,
  setApiKey,
  setModel,
  setOllamaEndpoint,
  setIsSettingsModalOpen,
} = aiConfigSlice.actions;

export const selectAIConfig = (state: { aiConfig: AIConfigState }): AIConfig => ({
  provider: state.aiConfig.provider,
  apiKeys: state.aiConfig.apiKeys,
  models: state.aiConfig.models,
  ollamaEndpoint: state.aiConfig.ollamaEndpoint,
});