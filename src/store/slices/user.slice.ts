import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  preferences: {
    language: string;
    notifications: boolean;
  };
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  theme: 'light',
  preferences: {
    language: 'en',
    notifications: true,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout: state => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    toggleTheme: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<UserState['preferences']>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.preferences.language = action.payload;
    },
    toggleNotifications: state => {
      state.preferences.notifications = !state.preferences.notifications;
    },
  },
});

export const {
  setUser,
  logout,
  toggleTheme,
  setTheme,
  updatePreferences,
  setLanguage,
  toggleNotifications,
} = userSlice.actions;
