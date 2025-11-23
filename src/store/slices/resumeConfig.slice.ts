import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ResumeConfig } from '@/types';
import { saveResumeConfig, loadResumeConfig } from '@/utils';
import resumeConfigDefault from '@/config/resume-ai-config.json';

export interface ResumeConfigState {
  config: ResumeConfig;
}

const ensureConfigCompatibility = (config: ResumeConfig): ResumeConfig => {
  const updatedConfig = { ...config };
  
  if (!updatedConfig.education.placement) {
    updatedConfig.education.placement = 'main-content';
  }
  
  if (!updatedConfig.pdf) {
    updatedConfig.pdf = { singlePageExport: false };
  }
  
  return updatedConfig;
};

const initialState: ResumeConfigState = {
  config: ensureConfigCompatibility(resumeConfigDefault as ResumeConfig),
};

export const resumeConfigSlice = createSlice({
  name: 'resumeConfig',
  initialState,
  reducers: {
    loadResumeConfigFromStorage: (state) => {
      const loadedConfig = loadResumeConfig();
      if (loadedConfig) {
        state.config = ensureConfigCompatibility(loadedConfig);
      }
    },
    
    updateResumeConfig: (state, action: PayloadAction<ResumeConfig>) => {
      const updatedConfig = ensureConfigCompatibility(action.payload);
      state.config = updatedConfig;
      saveResumeConfig(updatedConfig);
    },
    
    updateExperienceSettings: (state, action: PayloadAction<Partial<ResumeConfig['experience']>>) => {
      state.config.experience = {
        ...state.config.experience,
        ...action.payload,
      };
      saveResumeConfig(state.config);
    },
    
    updateSkillsSettings: (state, action: PayloadAction<Partial<ResumeConfig['skills']>>) => {
      state.config.skills = {
        ...state.config.skills,
        ...action.payload,
      };
      saveResumeConfig(state.config);
    },
    
    updateEducationSettings: (state, action: PayloadAction<Partial<ResumeConfig['education']>>) => {
      state.config.education = {
        ...state.config.education,
        ...action.payload,
      };
      saveResumeConfig(state.config);
    },
    
    updatePdfSettings: (state, action: PayloadAction<Partial<ResumeConfig['pdf']>>) => {
      state.config.pdf = {
        ...state.config.pdf,
        ...action.payload,
      };
      saveResumeConfig(state.config);
    },
    
    addExcludeJob: (state, action: PayloadAction<string>) => {
      if (action.payload.trim()) {
        state.config.experience.exclude.push(action.payload.trim());
        saveResumeConfig(state.config);
      }
    },
    
    removeExcludeJob: (state, action: PayloadAction<number>) => {
      state.config.experience.exclude = state.config.experience.exclude.filter(
        (_, index) => index !== action.payload
      );
      saveResumeConfig(state.config);
    },
    
    addExcludeEducation: (state, action: PayloadAction<string>) => {
      if (action.payload.trim()) {
        state.config.education.exclude.push(action.payload.trim());
        saveResumeConfig(state.config);
      }
    },
    
    removeExcludeEducation: (state, action: PayloadAction<number>) => {
      state.config.education.exclude = state.config.education.exclude.filter(
        (_, index) => index !== action.payload
      );
      saveResumeConfig(state.config);
    },
    
    resetResumeConfig: (state) => {
      state.config = ensureConfigCompatibility(resumeConfigDefault as ResumeConfig);
      saveResumeConfig(state.config);
    },
  },
});

export const {
  loadResumeConfigFromStorage,
  updateResumeConfig,
  updateExperienceSettings,
  updateSkillsSettings,
  updateEducationSettings,
  updatePdfSettings,
  addExcludeJob,
  removeExcludeJob,
  addExcludeEducation,
  removeExcludeEducation,
  resetResumeConfig,
} = resumeConfigSlice.actions;