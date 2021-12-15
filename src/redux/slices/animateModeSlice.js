import { createSlice } from "@reduxjs/toolkit";

export const animateModeSlice = createSlice({
  name: "animateMode",
  initialState: {
    mode: null, // properties, record
    status: null, // for record mode only: yes, ready
  },
  reducers: {
    changeMode: (state, { payload }) => {
      state.mode = payload.mode;
      state.status = payload.status;
    },
  },
});

export const { changeMode } = animateModeSlice.actions;
export default animateModeSlice.reducer;
