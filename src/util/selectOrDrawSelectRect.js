import React, { useEffect, useRef, useState } from "react";
import { blue } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { select as selectDispatch } from "../redux/slices/selectRegionSlice";

const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default function DrawSelectRect() {
  const dispatch = useDispatch();
  // the coordinates when mouse is clicked
  const [mouseDownX, setMouseDownX] = useState();
  const [mouseDownY, setMouseDownY] = useState();
  // coordinates of the rect
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  // width and height of the rect
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  // Main mode state
  const mainMode = useSelector((state) => state.mainMode);
  // Flag state, true when mouse is up
  const [mouseIsUp, setMouseIsUp] = useState(false);
  // Previous mouse is up state
  const prevMouseIsUp = usePrevious(mouseIsUp);

  /**
   * Mouse down event handler
   * @param {object} e mouse down event
   */
  const onMouseDown = (e) => {
    setMouseIsUp(false);
    // record the coordinates of the mouse click
    setMouseDownX(e.clientX);
    setMouseDownY(e.clientY);
  };

  /**
   * Mouse move event handler
   * @param {object} e mouse move event
   */
  const onMouseMove = (e) => {
    // draw the rect only if mouse is down (i.e. mouseDownX and mouseDownY are valid)
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
    setMouseIsUp(true);
  };

  useEffect(() => {
    if (mouseIsUp && !prevMouseIsUp) {
      if (x || y || width || height) {
        // user is drawing select rect
        // dispatch select stats to redux store
        dispatch(selectDispatch({ x, y, width, height }));
      } else {
        // user is clicking shape
        // dispatch only the mouse down coordinates
        dispatch(selectDispatch({ x: mouseDownX, y: mouseDownY }));
      }
      // clear mouse down coordinates and rect values
      setMouseDownX(null);
      setMouseDownY(null);
      setX(0);
      setY(0);
      setWidth(0);
      setHeight(0);
    }
  }, [mouseIsUp, prevMouseIsUp, x, y, width, height, mouseDownX, mouseDownY]);

  useEffect(() => {
    if (mainMode.mode === "select" || mainMode.mode === "animate") {
      // register event listeners
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      return () => {
        document.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [mainMode]);

  if (mainMode.mode === "select" || mainMode.mode === "animate") {
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: "rgba(187, 222, 251, .5)", // blue[100] w/ .5 alpha
          stroke: blue[400],
        }}
      />
    );
  } else {
    return null;
  }
}
