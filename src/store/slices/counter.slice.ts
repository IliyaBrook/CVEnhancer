import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  value: number;
  step: number;
}

const initialState: CounterState = {
  value: 0,
  step: 1,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      state.value += state.step;
    },
    decrement: state => {
      state.value -= state.step;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    reset: state => {
      state.value = 0;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount, reset, setStep } =
  counterSlice.actions;
