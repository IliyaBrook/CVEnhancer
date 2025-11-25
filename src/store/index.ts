export { store, persistor } from './store';
export type { RootState, AppDispatch, AppStore } from './store';

export { useAppDispatch, useAppSelector } from './hooks';

export { aiApi } from './api';

export { aiConfigSlice, appSlice } from './slices';
export {
  setProvider,
  setApiKey,
  setModel,
  setOllamaEndpoint,
  setIsSettingsModalOpen,
  selectAIConfig,
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
  setTemplateMode,
} from './slices';