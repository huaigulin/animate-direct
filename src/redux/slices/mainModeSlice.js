import { createSlice } from "@reduxjs/toolkit";

export const mainModeSlice = createSlice({
  name: "mainMode",
  initialState: {
    mode: null, // select, brush, shape, text, mouse, keyboard, animate
    subMode: null, // shape: line, ellipse, rect，quad, triangle
  },
  reducers: {
    changeMode: (state, { payload }) => {
      state.mode = payload.mode;
      state.subMode = payload.subMode;
    },
  },
});

export const { changeMode } = mainModeSlice.actions;
export default mainModeSlice.reducer;
