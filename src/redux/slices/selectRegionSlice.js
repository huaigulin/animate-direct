import { createSlice } from "@reduxjs/toolkit";

export const selectRegionSlice = createSlice({
  name: "selectRegion",
  initialState: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  reducers: {
    select: (state, { payload }) => {
      state.x = payload.x;
      state.y = payload.y;
      state.width = payload.width;
      state.height = payload.height;
    },
  },
});

export const { select } = selectRegionSlice.actions;
export default selectRegionSlice.reducer;
