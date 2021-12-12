import { configureStore } from "@reduxjs/toolkit";
import drawEllipseSlice from "./slices/drawEllipseSlice";

export default configureStore({
  reducer: {
    drawEllipse: drawEllipseSlice,
  },
});
