import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ResumeConfig } from '@/types';
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
    updateResumeConfig: (state, action: PayloadAction<ResumeConfig>) => {
      state.config = ensureConfigCompatibility(action.payload);
    },
    
    updateExperienceSettings: (state, action: PayloadAction<Partial<ResumeConfig['experience']>>) => {
      state.config.experience = {
        ...state.config.experience,
        ...action.payload,
      };
    },
    
    updateSkillsSettings: (state, action: PayloadAction<Partial<ResumeConfig['skills']>>) => {
      state.config.skills = {
        ...state.config.skills,
        ...action.payload,
      };
    },
    
    updateEducationSettings: (state, action: PayloadAction<Partial<ResumeConfig['education']>>) => {
      state.config.education = {
        ...state.config.education,
        ...action.payload,
      };
    },
    
    updatePdfSettings: (state, action: PayloadAction<Partial<ResumeConfig['pdf']>>) => {
      state.config.pdf = {
        ...state.config.pdf,
        ...action.payload,
      };
    },
    
    addExcludeJob: (state, action: PayloadAction<string>) => {
      if (action.payload.trim()) {
        state.config.experience.exclude.push(action.payload.trim());
      }
    },
    
    removeExcludeJob: (state, action: PayloadAction<number>) => {
      state.config.experience.exclude = state.config.experience.exclude.filter(
        (_, index) => index !== action.payload
      );
    },
    
    addExcludeEducation: (state, action: PayloadAction<string>) => {
      if (action.payload.trim()) {
        state.config.education.exclude.push(action.payload.trim());
      }
    },
    
    removeExcludeEducation: (state, action: PayloadAction<number>) => {
      state.config.education.exclude = state.config.education.exclude.filter(
        (_, index) => index !== action.payload
      );
    },
    
    resetResumeConfig: (state) => {
      state.config = ensureConfigCompatibility(resumeConfigDefault as ResumeConfig);
    },
  },
});

export const {
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