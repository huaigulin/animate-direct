import { configureStore } from "@reduxjs/toolkit";
import animateModeSlice from "./slices/animateModeSlice";
import drawEllipseSlice from "./slices/drawEllipseSlice";
import mainModeSlice from "./slices/mainModeSlice";
import shapeFocusSlice from "./slices/shapeFocusSlice";

export default configureStore({
  reducer: {
    animateMode: animateModeSlice,
    drawEllipse: drawEllipseSlice,
    mainMode: mainModeSlice,
    shapeFocus: shapeFocusSlice,
  },
});
