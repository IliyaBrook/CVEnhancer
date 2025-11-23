import { configureStore } from '@reduxjs/toolkit';

import { aiApi } from '@/store/api';
import { aiConfigSlice, appSlice, resumeConfigSlice } from '@/store/slices';

export const store = configureStore({
  reducer: {
    [aiApi.reducerPath]: aiApi.reducer,
    aiConfig: aiConfigSlice.reducer,
    app: appSlice.reducer,
    resumeConfig: resumeConfigSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
      },
    }).concat(aiApi.middleware),
  devTools: import.meta.env.MODE !== 'production',
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];