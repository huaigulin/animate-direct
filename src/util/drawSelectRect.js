import React, { useEffect, useState } from "react";
import { blue } from "@mui/material/colors";

export default function DrawSelectRect() {
  const [mouseDownX, setMouseDownX] = useState();
  const [mouseDownY, setMouseDownY] = useState();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  /**
   * Mouse down event handler
   * @param {object} e mouse down event
   */
  const onMouseDown = (e) => {
    console.log(e);
    setMouseDownX(e.clientX);
    setMouseDownY(e.clientY);
  };

  /**
   * Mouse move event handler
   * @param {object} e mouse move event
   */
  const onMouseMove = (e) => {
    console.log(e);
    const { clientX, clientY } = e;
    setMouseDownX((mouseDownX) => {
      setMouseDownY((mouseDownY) => {
        if (mouseDownX && mouseDownY) {
          if (clientX - mouseDownX > 0 && clientY - mouseDownY > 0) {
            setX(mouseDownX);
            setY(mouseDownY);
            setWidth(clientX - mouseDownX);
            setHeight(clientY - mouseDownY);
          } else if (clientX - mouseDownX > 0) {
            setX(mouseDownX);
            setY(clientY);
            setWidth(clientX - mouseDownX);
            setHeight(mouseDownY - clientY);
          } else if (clientY - mouseDownY > 0) {
            setX(clientX);
            setY(mouseDownY);
            setWidth(mouseDownX - clientX);
            setHeight(clientY - mouseDownY);
          } else {
            setX(clientX);
            setY(clientY);
            setWidth(mouseDownX - clientX);
            setHeight(mouseDownY - clientY);
          }
        }
        return mouseDownY;
      });
      return mouseDownX;
    });
  };

  /**
   * Mouse up event handler
   * @param {object} e mouse up event
   */
  const onMouseUp = (e) => {
    console.log(e);
    setMouseDownX(null);
    setMouseDownY(null);
    setX(0);
    setY(0);
    setWidth(0);
    setHeight(0);
  };

  useEffect(() => {
    // register event listeners
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      style={{
        fill: "rgba(187, 222, 251, .5)", // blue[100] w/ .5 alpha
        stroke: blue[400],
        cursor: "grab",
      }}
    />
  );
}
