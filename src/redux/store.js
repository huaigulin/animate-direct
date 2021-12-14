import { configureStore } from "@reduxjs/toolkit";
import animateModeSlice from "./slices/animateModeSlice";
import drawEllipseSlice from "./slices/drawEllipseSlice";

export default configureStore({
  reducer: {
    animateMode: animateModeSlice,
    drawEllipse: drawEllipseSlice,
  },
});
