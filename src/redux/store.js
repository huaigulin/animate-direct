import { configureStore } from "@reduxjs/toolkit";
import drawEllipseSlice from "./slices/drawEllipseSlice";
import mainModeSlice from "./slices/mainModeSlice";
import shapeFocusSlice from "./slices/shapeFocusSlice";

export default configureStore({
  reducer: {
    drawEllipse: drawEllipseSlice,
    mainMode: mainModeSlice,
    shapeFocus: shapeFocusSlice,
  },
});
