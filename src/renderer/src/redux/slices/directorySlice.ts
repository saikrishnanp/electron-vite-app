import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  path: "D:\\",
};

const directorySlice = createSlice({
  name: "directory",
  initialState,
  reducers: {
    setDirectory: (state, action) => {
      state.path = action.payload;
    },
  },
});

export const { setDirectory } = directorySlice.actions;
export default directorySlice.reducer;
