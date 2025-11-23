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
  ollamaModels: string[];
  showSuggestions: boolean;
  filteredModels: string[];
  isSettingsModalOpen: boolean;
}

const initialState: AIConfigState = {
  config: null,
  provider: AIProviderEnum.OPENAI,
  apiKeys: {},
  models: {},
  ollamaEndpoint: 'http://localhost:11434',
  ollamaModels: [],
  showSuggestions: false,
  filteredModels: [],
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
    
    setOllamaModels: (state, action: PayloadAction<string[]>) => {
      state.ollamaModels = action.payload;
      state.filteredModels = action.payload;
    },
    
    setShowSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestions = action.payload;
    },
    
    setFilteredModels: (state, action: PayloadAction<string[]>) => {
      state.filteredModels = action.payload;
    },
    
    filterModels: (state, action: PayloadAction<string>) => {
      const query = action.payload;
      if (query.trim() === '') {
        state.filteredModels = state.ollamaModels;
      } else {
        state.filteredModels = state.ollamaModels.filter(m =>
          m.toLowerCase().includes(query.toLowerCase())
        );
      }
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
  setOllamaModels,
  setShowSuggestions,
  setFilteredModels,
  filterModels,
  setIsSettingsModalOpen,
} = aiConfigSlice.actions;