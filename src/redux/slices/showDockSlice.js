import { createSlice } from "@reduxjs/toolkit";

export const showDockSlice = createSlice({
  name: "showDock",
  initialState: {
    show: false,
  },
  reducers: {
    setShow: (state, { payload }) => {
      state.show = payload.show;
    },
  },
});

export const { setShow } = showDockSlice.actions;
export default showDockSlice.reducer;
