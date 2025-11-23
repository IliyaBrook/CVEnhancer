import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

import { aiApi } from '@/store/api';
import { aiConfigSlice, appSlice, resumeConfigSlice } from '@/store/slices';
import type { AIConfigState } from '@/store/slices/aiConfig.slice';
import type { AppState } from '@/store/slices/app.slice';
import type { ResumeConfigState } from '@/store/slices/resumeConfig.slice';
import {
  aiConfigPersistConfig,
  resumeConfigPersistConfig,
  appPersistConfig,
  createPersistedReducer
} from '@/store/persistConfig';

export const store = configureStore({
  reducer: {
    [aiApi.reducerPath]: aiApi.reducer,
    aiConfig: createPersistedReducer(aiConfigPersistConfig, aiConfigSlice.reducer) as any,
    app: createPersistedReducer(appPersistConfig, appSlice.reducer) as any,
    resumeConfig: createPersistedReducer(resumeConfigPersistConfig, resumeConfigSlice.reducer) as any,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }).concat(aiApi.middleware),
  devTools: import.meta.env.MODE !== 'production',
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = {
  [aiApi.reducerPath]: ReturnType<typeof aiApi.reducer>;
  aiConfig: AIConfigState;
  app: AppState;
  resumeConfig: ResumeConfigState;
};
export type AppDispatch = AppStore['dispatch'];