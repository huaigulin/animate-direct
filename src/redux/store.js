import { configureStore } from "@reduxjs/toolkit";
import animateModeSlice from "./slices/animateModeSlice";
import drawEllipseSlice from "./slices/drawEllipseSlice";
import shapeFocusSlice from "./slices/shapeFocusSlice";

export default configureStore({
  reducer: {
    animateMode: animateModeSlice,
    drawEllipse: drawEllipseSlice,
    shapeFocus: shapeFocusSlice,
  },
});
