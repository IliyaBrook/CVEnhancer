// Export slices
export { exampleSlice } from './example.slice';
export { counterSlice } from './counter.slice';
export { userSlice } from './user.slice';

// Export actions
export {
  addItem,
  toggleItem,
  removeItem,
  setFilter,
  setLoading,
} from './example.slice';
export {
  increment,
  decrement,
  incrementByAmount,
  reset,
  setStep,
} from './counter.slice';
export {
  setUser,
  logout,
  toggleTheme,
  setTheme,
  updatePreferences,
  setLanguage,
  toggleNotifications,
} from './user.slice';
