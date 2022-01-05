import { createSlice } from "@reduxjs/toolkit";

export const showDockSlice = createSlice({
  name: "showDock",
  initialState: {
    show: false,
    active: false,
  },
  reducers: {
    setShow: (state, { payload }) => {
      state.show = payload.show;
    },
    setActive: (state, { payload }) => {
      state.active = payload.active;
    },
  },
});

export const { setShow, setActive } = showDockSlice.actions;
export default showDockSlice.reducer;
