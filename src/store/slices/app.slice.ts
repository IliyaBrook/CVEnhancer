import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ResumeData, ProcessingStatus } from '@/types';

export interface SaveModalState {
  isOpen: boolean;
  filename: string;
  status: 'idle' | 'saving' | 'success' | 'error';
  error: string;
}

export interface JsonFileSelectorState {
  files: Array<{ name: string; displayName: string }>;
  loading: boolean;
  error: string;
}

export interface AppState {
  resumeData: ResumeData | null;
  status: ProcessingStatus;
  error: string;
  jobTitle: string;
  selectedJsonFile: string;
  saveModal: SaveModalState;
  jsonFileSelector: JsonFileSelectorState;
}

const initialState: AppState = {
  resumeData: null,
  status: 'idle',
  error: '',
  jobTitle: '',
  selectedJsonFile: '',
  saveModal: {
    isOpen: false,
    filename: '',
    status: 'idle',
    error: '',
  },
  jsonFileSelector: {
    files: [],
    loading: false,
    error: '',
  },
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
    
    setJobTitle: (state, action: PayloadAction<string>) => {
      state.jobTitle = action.payload;
    },
    
    setSelectedJsonFile: (state, action: PayloadAction<string>) => {
      state.selectedJsonFile = action.payload;
    },
    
    openSaveModal: (state) => {
      state.saveModal.isOpen = true;
      state.saveModal.filename = '';
      state.saveModal.status = 'idle';
      state.saveModal.error = '';
    },
    
    closeSaveModal: (state) => {
      state.saveModal.isOpen = false;
      state.saveModal.filename = '';
      state.saveModal.status = 'idle';
      state.saveModal.error = '';
    },
    
    setSaveModalFilename: (state, action: PayloadAction<string>) => {
      state.saveModal.filename = action.payload;
    },
    
    setSaveModalStatus: (state, action: PayloadAction<SaveModalState['status']>) => {
      state.saveModal.status = action.payload;
    },
    
    setSaveModalError: (state, action: PayloadAction<string>) => {
      state.saveModal.error = action.payload;
    },
    
    setJsonFiles: (state, action: PayloadAction<Array<{ name: string; displayName: string }>>) => {
      state.jsonFileSelector.files = action.payload;
    },
    
    setJsonFilesLoading: (state, action: PayloadAction<boolean>) => {
      state.jsonFileSelector.loading = action.payload;
    },
    
    setJsonFilesError: (state, action: PayloadAction<string>) => {
      state.jsonFileSelector.error = action.payload;
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
  setJobTitle,
  setSelectedJsonFile,
  resetState,
  openSaveModal,
  closeSaveModal,
  setSaveModalFilename,
  setSaveModalStatus,
  setSaveModalError,
  setJsonFiles,
  setJsonFilesLoading,
  setJsonFilesError,
} = appSlice.actions;