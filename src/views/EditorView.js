import React, { createRef, useEffect, useLayoutEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Alert as MuiAlert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Dock from "../components/Dock";
import Canvas from "../components/Canvas";
import DrawEllipse from "../util/drawEllipse";
import AnimateControl from "../components/AnimateControl";
import PropertyDisplay from "../components/PropertyDisplay";
import DrawSelectRect from "../util/selectOrDrawSelectRect";
import DrawLiveEllipse from "../util/drawLiveEllipse";
import { setShow as setShowDispatch } from "../redux/slices/showDockSlice";
import {
  append as appendDispatch,
  replaceAll as replaceAllDispatch,
  replaceOne as replaceOneDispatch,
} from "../redux/slices/drawDataSlice";

/**
 * Custom hook to monitor window height and width
 * @returns [windowWidth, windowHeight]
 */
function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export default function EditorView(props) {
  const dispatch = useDispatch();
  const canvasRef = createRef();
  // Window width and height states
  const [windowWidth, windowHeight] = useWindowSize();
  // Drawing data and reference data
  const drawData = useSelector((state) => state.drawData.data);
  const [referenceData, setReferenceData] = useState([]);
  // The finished drawing that goes into the <svg /> tag
  const [drawing, setDrawing] = useState();
  // Snackbar properties
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgSeverity, setMsgSeverity] = useState();
  const [msg, setMsg] = useState();
  // The data from drawEllipse reducer, which is the shape data of ellipse
  const ellipseStats = useSelector((state) => state.drawEllipse);
  // Main mode status
  const mainMode = useSelector((state) => state.mainMode);
  // mouseX and mouseY state
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  // Show or hide dock state
  const showDock = useSelector((state) => state.showDock);

  /**
   * Callback to handle close msg bar
   * @param {object} event
   * @param {string} reason
   */
  const handleMsgClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMsgOpen(false);
  };

  /**
   * Updates the data that are shown on canvas but are not included in final output
   * @param {boolean} appendMode if true append to current data, else replace it
   * @param {object} data must contain "id" and "code" properties
   */
  const updateReferenceData = (appendMode, data) => {
    if (appendMode) {
      setReferenceData([...referenceData, data]);
    } else {
      setReferenceData([data]);
    }
  };

  /**
   * Callback for mousemove event
   * @param {object} e mousemove event object
   */
  const onMouseMove = (e) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    if (
      (mouseX > windowWidth - 96 &&
        mouseY < 576 &&
        mainMode.mode !== "zooming" &&
        mainMode.mode !== "dragging" &&
        mainMode.status !== "drawing") ||
      showDock.active
    ) {
      dispatch(setShowDispatch({ show: true }));
    } else if (showDock.show && !showDock.active) {
      dispatch(setShowDispatch({ show: false }));
    }
  }, [mouseX, mouseY, windowWidth, mainMode, showDock]);

  useEffect(() => {
    // loops through drawData state and draws on canvas
    const shapes = [];
    drawData.forEach((data, idx) => {
      switch (data.shape) {
        case "ellipse":
          shapes.push(
            <DrawEllipse
              key={uuidv4()}
              id={data.id}
              x={data.positionX}
              y={data.positionY}
              radiusX={data.radiusX}
              radiusY={data.radiusY}
              deg={data.deg}
            />
          );
          break;
        default:
          console.log(
            "<!!!!!!!!!!!!!!!!!!! Unhandled drawData !!!!!!!!!!!!!!!!!>"
          );
      }
    });
    setDrawing(shapes);
  }, [drawData, windowWidth, windowHeight]);

  useEffect(() => {
    const { mode, x, y, rx, ry, deg, xDiff, yDiff, rxDiff, ryDiff, degDiff } =
      ellipseStats;
    if (
      x ||
      y ||
      rx ||
      ry ||
      deg ||
      xDiff ||
      yDiff ||
      rxDiff ||
      ryDiff ||
      degDiff
    ) {
      switch (mode) {
        case "new":
          console.log(ellipseStats);
          // open the snackbar to display msg
          setMsgSeverity("success");
          setMsg(
            <span>
              Draw ellipse at{" "}
              <i>
                ({+x.toFixed(2)}, {+y.toFixed(2)})
              </i>{" "}
              with radiusX <i>{+rx.toFixed(2)}</i>, radiusY{" "}
              <i>{+ry.toFixed(2)}</i>, rotation <i>{deg}</i>
            </span>
          );
          setMsgOpen(true);
          break;
        case "move":
          console.log(ellipseStats);
          // open the snackbar to display msg
          setMsgSeverity("info");
          setMsg(
            <span>
              Move ellipse by x <i>{+xDiff.toFixed(2)}</i>, y{" "}
              <i>{+yDiff.toFixed(2)}</i> to{" "}
              <i>
                ({+x.toFixed(2)}, {+y.toFixed(2)})
              </i>
            </span>
          );
          setMsgOpen(true);
          // update draw data when move finishes
          dispatch(
            replaceOneDispatch({
              id: ellipseStats.id,
              newShape: {
                id: ellipseStats.id,
                shape: "ellipse",
                positionX: x,
                positionY: y,
                radiusX: rx,
                radiusY: ry,
                deg: deg,
                code: `ellipse(${x}, ${y}, ${rx}, ${ry}, ${deg})`,
              },
            })
          );
          break;
        case "zoom":
          console.log(ellipseStats);
          setMsgSeverity("info");
          setMsg(
            <span>
              Change ellipse size by radiusX <i>{+rxDiff.toFixed(2)}</i>,
              radiusY <i>{+ryDiff.toFixed(2)}</i> with new radiusX{" "}
              <i>{+rx.toFixed(2)}</i>, new radiusY <i>{+ry.toFixed(2)}</i>, new
              coordinates{" "}
              <i>
                ({+x.toFixed(2)}, {+y.toFixed(2)})
              </i>
            </span>
          );
          setMsgOpen(true);
          // update draw data when zoom finishes
          dispatch(
            replaceOneDispatch({
              id: ellipseStats.id,
              newShape: {
                id: ellipseStats.id,
                shape: "ellipse",
                positionX: x,
                positionY: y,
                radiusX: rx,
                radiusY: ry,
                deg: deg,
                code: `ellipse(${x}, ${y}, ${rx}, ${ry}, ${deg})`,
              },
            })
          );
          break;
        case "liveMove":
          console.log(ellipseStats);
          // make sure snackbar does not show up when dragging is still in progress
          setMsgOpen(false);
          break;
        case "liveZoom":
          console.log(ellipseStats);
          setMsgOpen(false);
          break;
        default:
          console.log(
            "<!!!!!!!!!!!!!!!!!!! Unhandled ellipseStats !!!!!!!!!!!!!!!!!>"
          );
          console.log(ellipseStats);
      }
    }
  }, [ellipseStats]);

  return (
    <Grid container>
      <Canvas ref={canvasRef}>
        <Snackbar
          open={msgOpen}
          autoHideDuration={6000}
          onClose={handleMsgClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          key={ellipseStats.id}
        >
          <Alert
            onClose={handleMsgClose}
            severity={msgSeverity}
            sx={{ width: "100%", alignItems: "center" }}
          >
            {msg}
          </Alert>
        </Snackbar>
        <svg
          viewBox={`0 0 ${windowWidth} ${windowHeight}`}
          xmlns='http://www.w3.org/2000/svg'
          style={{
            cursor: mainMode.mode === "shape" ? "crosshair" : "default",
          }}
        >
          {drawing}
          <DrawLiveEllipse />
          <DrawSelectRect />
        </svg>
        {mainMode.mode === "animate" && mainMode.subMode === "properties" ? (
          <PropertyDisplay />
        ) : null}
        {mainMode.mode === "animate" &&
        mainMode.subMode === "record" &&
        mainMode.status === "ready" ? (
          <AnimateControl />
        ) : null}
      </Canvas>
      <Dock />
    </Grid>
  );
}
