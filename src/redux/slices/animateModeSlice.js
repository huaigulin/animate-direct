import { createSlice } from "@reduxjs/toolkit";

export const animateModeSlice = createSlice({
  name: "animateMode",
  initialState: {
    mode: "no", // yes, no, ready
  },
  reducers: {
    changeMode: (state, { payload }) => {
      state.mode = payload.mode;
    },
  },
});

export const { changeMode } = animateModeSlice.actions;
export default animateModeSlice.reducer;
