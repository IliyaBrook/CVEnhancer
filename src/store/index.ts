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
  setResumeData,
  setStatus,
  setError,
  setIsSaveModalOpen,
  setJobTitle,
  setSelectedJsonFile,
  resetState,
} from './slices';