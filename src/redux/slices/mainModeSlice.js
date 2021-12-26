import { createSlice } from "@reduxjs/toolkit";

export const mainModeSlice = createSlice({
  name: "mainMode",
  initialState: {
    mode: null, // select, brush, shape, text, mouse, keyboard, animate, zooming. dragging
    subMode: null, // shape: line, ellipse, rect，quad, triangle;
    // animate: properties, record
    status: null, // for animate mode record subMode only: yes, ready
  },
  reducers: {
    changeMode: (state, { payload }) => {
      state.mode = payload.mode;
      state.subMode = payload.subMode;
      state.status = payload.status;
    },
  },
});

export const { changeMode } = mainModeSlice.actions;
export default mainModeSlice.reducer;
