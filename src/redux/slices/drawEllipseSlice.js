import { createSlice } from "@reduxjs/toolkit";

export const drawEllipseSlice = createSlice({
  name: "drawCircle",
  initialState: {
    mode: "new",
    x: 0,
    y: 0,
    rx: 0,
    ry: 0,
    deg: 0,
    xDiff: 0,
    yDiff: 0,
    rxDiff: 0,
    ryDiff: 0,
    degDiff: 0,
  },
  reducers: {
    newDraw: (state, { payload }) => {
      state.mode = "new";
      state.x = payload.x;
      state.y = payload.y;
      state.rx = payload.rx;
      state.ry = payload.ry;
      state.deg = payload.deg;
    },
    move: (state, { payload }) => {
      state.mode = "move";
      state.x = payload.x;
      state.y = payload.y;
      state.xDiff = payload.xDiff;
      state.yDiff = payload.yDiff;
    },
    zoom: (state, { payload }) => {
      state.mode = "zoom";
      state.x = payload.x;
      state.y = payload.y;
      state.xDiff = payload.xDiff;
      state.yDiff = payload.yDiff;
      state.rx = payload.rx;
      state.ry = payload.ry;
      state.rxDiff = payload.rxDiff;
      state.ryDiff = payload.ryDiff;
    },
    rotate: (state, { payload }) => {
      state.mode = "rotate";
      state.degDiff = payload.degDiff;
    },
    liveUpdate: (state, { payload }) => {
      state.mode = payload.mode;
      state.x = payload.x;
      state.y = payload.y;
      state.rx = payload.rx;
      state.ry = payload.ry;
      state.deg = payload.deg;
      state.xDiff = payload.xDiff;
      state.yDiff = payload.yDiff;
      state.rxDiff = payload.rxDiff;
      state.ryDiff = payload.ryDiff;
      state.degDiff = payload.degDiff;
    },
  },
});

export const { newDraw, move, zoom, rotate, liveUpdate } =
  drawEllipseSlice.actions;
export default drawEllipseSlice.reducer;
