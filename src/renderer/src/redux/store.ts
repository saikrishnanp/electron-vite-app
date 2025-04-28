/* eslint-disable prettier/prettier */
import { configureStore } from '@reduxjs/toolkit';
import testStepsReducer from './slices/testStepsSlice';

const store = configureStore({
  reducer: {
    testSteps: testStepsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;