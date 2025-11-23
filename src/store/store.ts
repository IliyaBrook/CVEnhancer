import { configureStore } from '@reduxjs/toolkit';

import { exampleApi } from '@/store/api';
import { counterSlice, exampleSlice, userSlice } from '@/store/slices';

export const store = configureStore({
  reducer: {
    // API slice
    [exampleApi.reducerPath]: exampleApi.reducer,

    // Feature slices
    example: exampleSlice.reducer,
    counter: counterSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore RTK Query actions
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
      },
    }).concat(exampleApi.middleware),
  devTools: import.meta.env.MODE !== 'production',
});

// Get the type of our store variable
export type AppStore = typeof store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
// Inferred type: {example: ExampleState, counter: CounterState, user: UserState}
export type AppDispatch = AppStore['dispatch'];
