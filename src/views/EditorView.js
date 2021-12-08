import React, { createRef, useEffect, useLayoutEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Dock from "../components/Dock";
import Canvas from "../components/Canvas";

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

export default function EditorView(props) {
  const canvasRef = createRef();
  const [windowWidth, windowHeight] = useWindowSize();
  const [ctx, setCtx] = useState();
  const [drawData, setDrawData] = useState([]);
  const [referenceData, setReferenceData] = useState([]);

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
  }, []);

  useEffect(() => {
    drawData.forEach((data) => {
      switch (data.shape) {
        case "circle":
          const coordinates = data.position.split(", ");
          ctx.ellipse(
            coordinates[0],
            coordinates[1],
            data.radiusX,
            data.radiusY,
            0,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = "#FFFFFF";
          ctx.fill();
          ctx.stroke();
          break;
      }
    });
  }, [drawData, ctx, windowWidth, windowHeight]);

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
      <Canvas ref={canvasRef} />
      <Dock
        updateDrawData={updateDrawData}
        updateReferenceData={updateReferenceData}
      />
    </Grid>
  );
}
