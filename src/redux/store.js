import { configureStore } from "@reduxjs/toolkit";
import drawEllipseSlice from "./slices/drawEllipseSlice";
import mainModeSlice from "./slices/mainModeSlice";
import shapeFocusSlice from "./slices/shapeFocusSlice";
import selectRegionSlice from "./slices/selectRegionSlice";
import showDockSlice from "./slices/showDockSlice";

export default configureStore({
  reducer: {
    drawEllipse: drawEllipseSlice,
    mainMode: mainModeSlice,
    selectRegion: selectRegionSlice,
    shapeFocus: shapeFocusSlice,
    showDock: showDockSlice,
  },
});
