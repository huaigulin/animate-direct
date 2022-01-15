import { createSlice } from "@reduxjs/toolkit";

export const drawDataSlice = createSlice({
  name: "drawData",
  initialState: {
    data: [],
  },
  reducers: {
    append: (state, { payload }) => {
      state.data = [...state.data, ...payload.data];
      console.log("<-------Draw data updated!--------->");
    },
    replaceAll: (state, { payload }) => {
      state.data = payload.data;
      console.log("<-------Draw data updated!--------->");
    },
    replaceOne: (state, { payload }) => {
      const { id, newShape } = payload;
      const newData = state.data;
      const idx = newData.findIndex((shape) => shape.id === id);
      newData[idx] = newShape;
      state.data = newData;
      console.log("<-------Draw data updated!--------->");
    },
  },
});

export const { append, replaceAll, replaceOne } = drawDataSlice.actions;
export default drawDataSlice.reducer;
