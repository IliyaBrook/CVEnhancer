import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { Reducer } from '@reduxjs/toolkit';

const rootPersistConfig = {
  key: 'cvenhancer:root',
  storage,
  version: 1,
  blacklist: ['aiApi'],
};

const aiConfigPersistConfig = {
  key: 'cvenhancer:aiConfig',
  storage,
  whitelist: ['provider', 'apiKeys', 'models', 'ollamaEndpoint'],
};

const resumeConfigPersistConfig = {
  key: 'cvenhancer:resumeConfig',
  storage,
  whitelist: ['config'],
};

const appPersistConfig = {
  key: 'cvenhancer:app',
  storage,
  whitelist: ['jobTitle', 'selectedJsonFile'],
};

export const createPersistedReducer = <S>(
  config: { key: string; storage: typeof storage; whitelist: string[] },
  reducer: Reducer<S>
) => persistReducer(config, reducer);

export { rootPersistConfig, aiConfigPersistConfig, resumeConfigPersistConfig, appPersistConfig };