import React, { createRef, useEffect, useLayoutEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Alert as MuiAlert, Snackbar } from "@mui/material";
import { useSelector } from "react-redux";
import Dock from "../components/Dock";
import Canvas from "../components/Canvas";
import DrawEllipse from "../util/drawEllipse";

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
  const canvasRef = createRef();
  const [windowWidth, windowHeight] = useWindowSize();
  const [drawData, setDrawData] = useState([]);
  const [referenceData, setReferenceData] = useState([]);
  const [drawing, setDrawing] = useState();
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgSeverity, setMsgSeverity] = useState();
  const [msg, setMsg] = useState();
  const ellipseStats = useSelector((state) => state.drawEllipse);

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

  useEffect(() => {
    const shapes = [];
    drawData.forEach((data, idx) => {
      switch (data.shape) {
        case "circle":
          const coordinates = data.position.split(", ");
          const x = parseInt(coordinates[0]);
          const y = parseInt(coordinates[1]);
          shapes.push(
            <DrawEllipse
              x={x}
              y={y}
              radiusX={data.radiusX}
              radiusY={data.radiusY}
              deg={data.deg}
            />
          );
          break;
      }
    });
    setDrawing(shapes);
  }, [drawData, windowWidth, windowHeight]);

  useEffect(() => {
    console.log(ellipseStats);
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
          setMsgSeverity("success");
          setMsg(
            `Draw ellipse at x ${x}, y ${y} with radiusX ${rx}, radiusY ${ry}, rotation ${deg}`
          );
          break;
        case "move":
          setMsgSeverity("info");
          setMsg(`Move ellipse by x ${xDiff}, y ${yDiff} to (${x}, ${y})`);
          break;
      }
      setMsgOpen(true);
    }
  }, [ellipseStats]);

  /**
   * Updates the data used by p5 draw() function
   * @param {boolean} appendMode if true append to current data, else replace it
   * @param {object} data must contain "id" and "code" properties
   */
  const updateDrawData = (appendMode, data) => {
    if (appendMode) {
      setDrawData([...drawData, data]);
    } else {
      setDrawData([data]);
    }
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

  return (
    <Grid container>
      <Canvas ref={canvasRef}>
        <Snackbar
          open={msgOpen}
          autoHideDuration={6000}
          onClose={handleMsgClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleMsgClose}
            severity={msgSeverity}
            sx={{ width: "100%" }}
          >
            {msg}
          </Alert>
        </Snackbar>
        <svg
          viewBox={`0 0 ${windowWidth} ${windowHeight}`}
          xmlns='http://www.w3.org/2000/svg'
        >
          {drawing}
        </svg>
      </Canvas>
      <Dock
        updateDrawData={updateDrawData}
        updateReferenceData={updateReferenceData}
      />
    </Grid>
  );
}
