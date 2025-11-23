export { store } from './store';
export type { RootState, AppDispatch, AppStore } from './store';

export { useAppDispatch, useAppSelector } from './hooks';

export { aiApi, useFetchOllamaModelsQuery } from './api';

export { aiConfigSlice, appSlice } from './slices';
export {
  loadConfigFromStorage,
  setProvider,
  setApiKey,
  setModel,
  setOllamaEndpoint,
  setOllamaModels,
  setShowSuggestions,
  setFilteredModels,
  filterModels,
  setIsSettingsModalOpen,
  saveConfigToStorage,
  setResumeData,
  setStatus,
  setError,
  setIsSaveModalOpen,
  resetState,
} from './slices';