import React, { createRef, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Dock from "../components/Dock";
import Canvas from "../components/Canvas";

export default function EditorView(props) {
  const canvasRef = createRef();
  const [drawData, setDrawData] = useState([]);
  const [referenceData, setReferenceData] = useState([]);

  useEffect(() => {
    console.log(canvasRef.current);
  }, []);

  useEffect(() => {
    console.log(drawData);
  }, [drawData]);

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
