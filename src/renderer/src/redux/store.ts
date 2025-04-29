/* eslint-disable prettier/prettier */
import { configureStore } from "@reduxjs/toolkit";
import testStepsReducer from "./slices/testStepsSlice";
import directoryReducer from "./slices/directorySlice";

const store = configureStore({
  reducer: {
    testSteps: testStepsReducer,
    directory: directoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
