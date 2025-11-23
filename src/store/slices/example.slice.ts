import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ExampleState {
  items: Array<{
    id: number;
    title: string;
    completed: boolean;
  }>;
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
}

const initialState: ExampleState = {
  items: [
    { id: 1, title: 'Learn Redux Toolkit', completed: false },
    { id: 2, title: 'Build an example app', completed: true },
  ],
  filter: 'all',
  loading: false,
};

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ title: string }>) => {
      const newId = Math.max(...state.items.map(item => item.id), 0) + 1;
      state.items.push({
        id: newId,
        title: action.payload.title,
        completed: false,
      });
    },
    toggleItem: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.completed = !item.completed;
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setFilter: (
      state,
      action: PayloadAction<'all' | 'active' | 'completed'>
    ) => {
      state.filter = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addItem, toggleItem, removeItem, setFilter, setLoading } =
  exampleSlice.actions;
