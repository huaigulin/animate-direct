import { createSlice } from "@reduxjs/toolkit";

export const shapeFocusSlice = createSlice({
  name: "shapeFocus",
  initialState: {
    hasFocus: [],
  },
  reducers: {
    // payload.ids: array for shapes ids to add
    add: (state, { payload }) => {
      state.hasFocus = [...state.hasFocus, ...payload.ids];
    },
    // payload.ids: array for shapes ids to remove
    remove: (state, { payload }) => {
      payload.ids.forEach((id) => {
        const index = state.hasFocus.findIndex((elm) => elm.id === id);
        state.hasFocus.splice(index, 1);
      });
    },
    clear: (state) => {
      state.hasFocus = [];
    },
  },
});

export const { add, remove, clear } = shapeFocusSlice.actions;
export default shapeFocusSlice.reducer;
