export { store, persistor } from './store';
export type { RootState, AppDispatch, AppStore } from './store';

export { useAppDispatch, useAppSelector } from './hooks';

export { aiApi, useFetchOllamaModelsQuery } from './api';

export { aiConfigSlice, appSlice } from './slices';
export {
  setProvider,
  setApiKey,
  setModel,
  setOllamaEndpoint,
  setOllamaModels,
  setShowSuggestions,
  setFilteredModels,
  filterModels,
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