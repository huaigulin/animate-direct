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
  const [drawData, setDrawData] = useState([]);
  const [referenceData, setReferenceData] = useState([]);
  const [drawing, setDrawing] = useState();

  useEffect(() => {
    const shapes = [];
    drawData.forEach((data, idx) => {
      switch (data.shape) {
        case "circle":
          const coordinates = data.position.split(", ");
          shapes.push(
            <svg
              key={idx}
              viewBox={`0 0 ${windowWidth} ${windowHeight}`}
              xmlns='http://www.w3.org/2000/svg'
            >
              <ellipse
                cx={coordinates[0]}
                cy={coordinates[1]}
                rx={data.radiusX}
                ry={data.radiusY}
                style={{ fill: "#FFFFFF", stroke: "#000000" }}
              />
            </svg>
          );
          break;
      }
    });
    setDrawing(shapes);
  }, [drawData, windowWidth, windowHeight]);

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
      <Canvas ref={canvasRef}>{drawing}</Canvas>
      <Dock
        updateDrawData={updateDrawData}
        updateReferenceData={updateReferenceData}
      />
    </Grid>
  );
}
