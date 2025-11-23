// Export store configuration
export { store } from './store';
export type { RootState, AppDispatch, AppStore } from './store';

// Export API
export { exampleApi } from './api';
export type {
  ExampleItem,
  ExampleRequestType,
  ExampleResponseType,
  ExampleGetResponseType,
  ExamplePostResponseType,
  ExampleUpdateRequest,
} from './api/example.api';

// Export slices and actions
export { exampleSlice, counterSlice, userSlice } from './slices';

export {
  addItem,
  toggleItem,
  removeItem,
  setFilter,
  setLoading,
  increment,
  decrement,
  incrementByAmount,
  reset,
  setStep,
  setUser,
  logout,
  toggleTheme,
  setTheme,
  updatePreferences,
  setLanguage,
  toggleNotifications,
} from './slices';

// Export API hooks
export {
  useGetExampleItemsQuery,
  useGetExampleItemQuery,
  useCreateExampleItemMutation,
  useUpdateExampleItemMutation,
  useDeleteExampleItemMutation,
} from './api/example.api';
