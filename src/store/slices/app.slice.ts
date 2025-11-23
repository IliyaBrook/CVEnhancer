import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ResumeData, ProcessingStatus } from '@/types';

export interface AppState {
  resumeData: ResumeData | null;
  status: ProcessingStatus;
  error: string;
  isSaveModalOpen: boolean;
}

const initialState: AppState = {
  resumeData: null,
  status: 'idle',
  error: '',
  isSaveModalOpen: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setResumeData: (state, action: PayloadAction<ResumeData | null>) => {
      state.resumeData = action.payload;
    },
    
    setStatus: (state, action: PayloadAction<ProcessingStatus>) => {
      state.status = action.payload;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    setIsSaveModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSaveModalOpen = action.payload;
    },
    
    resetState: (state) => {
      state.resumeData = null;
      state.status = 'idle';
      state.error = '';
    },
  },
});

export const {
  setResumeData,
  setStatus,
  setError,
  setIsSaveModalOpen,
  resetState,
} = appSlice.actions;