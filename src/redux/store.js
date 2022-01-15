import { configureStore } from "@reduxjs/toolkit";
import drawDataSlice from "./slices/drawDataSlice";
import drawEllipseSlice from "./slices/drawEllipseSlice";
import mainModeSlice from "./slices/mainModeSlice";
import shapeFocusSlice from "./slices/shapeFocusSlice";
import selectRegionSlice from "./slices/selectRegionSlice";
import showDockSlice from "./slices/showDockSlice";

export default configureStore({
  reducer: {
    drawData: drawDataSlice,
    drawEllipse: drawEllipseSlice,
    mainMode: mainModeSlice,
    selectRegion: selectRegionSlice,
    shapeFocus: shapeFocusSlice,
    showDock: showDockSlice,
  },
});
