import { createSlice } from "@reduxjs/toolkit";

export const mainModeSlice = createSlice({
  name: "mainMode",
  initialState: {
    mode: null, // select, brush, shape, text, mouse, keyboard, animate
  },
  reducers: {
    changeMode: (state, { payload }) => {
      state.mode = payload.mode;
    },
  },
});

export const { changeMode } = mainModeSlice.actions;
export default mainModeSlice.reducer;
