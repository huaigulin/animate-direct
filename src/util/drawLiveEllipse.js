import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { newDraw as newDrawDispatch } from "../redux/slices/drawEllipseSlice";
import {
  add as addDispatch,
  clear as clearDispatch,
} from "../redux/slices/shapeFocusSlice";

const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default function DrawLiveEllipse({ updateDrawData }) {
  const dispatch = useDispatch();
  // Main mode status
  const mainMode = useSelector((state) => state.mainMode);
  // The coordinates when mouse is clicked
  const [, setMouseDownX] = useState();
  const [, setMouseDownY] = useState();
  // The coordinates of the ellipse
  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  // The radii of the ellipse
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);
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
    const { clientX, clientY } = e;
    setMouseDownX((mouseDownX) => {
      setMouseDownY((mouseDownY) => {
        if (mouseDownX && mouseDownY) {
          if (clientX > mouseDownX && clientY > mouseDownY) {
            const rxComp = (clientX - mouseDownX) / 2;
            const ryComp = (clientY - mouseDownY) / 2;
            setCx(mouseDownX + rxComp);
            setCy(mouseDownY + ryComp);
            setRx(rxComp);
            setRy(ryComp);
          } else if (clientX > mouseDownX) {
            const rxComp = (clientX - mouseDownX) / 2;
            const ryComp = (mouseDownY - clientY) / 2;
            setCx(mouseDownX + rxComp);
            setCy(clientY + ryComp);
            setRx(rxComp);
            setRy(ryComp);
          } else if (clientY > mouseDownY) {
            const rxComp = (mouseDownX - clientX) / 2;
            const ryComp = (clientY - mouseDownY) / 2;
            setCx(clientX + rxComp);
            setCy(mouseDownY + ryComp);
            setRx(rxComp);
            setRy(ryComp);
          } else {
            const rxComp = (mouseDownX - clientX) / 2;
            const ryComp = (mouseDownY - clientY) / 2;
            setCx(clientX + rxComp);
            setCy(clientY + ryComp);
            setRx(rxComp);
            setRy(ryComp);
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
    // only fires at the moment of mouse up
    if (mouseIsUp && !prevMouseIsUp) {
      const id = `ellipse-${uuidv4()}`;
      updateDrawData(true, {
        id,
        shape: "ellipse",
        position: `${cx}, ${cy}`,
        radiusX: rx,
        radiusY: ry,
        deg: 0,
        code: `ellipse(${cx}, ${cy}, ${rx}, ${ry}, 0);`,
      });
      // dispatch state to show snackbar info
      dispatch(
        newDrawDispatch({
          id,
          x: cx,
          y: cy,
          rx,
          ry,
          deg: 0,
        })
      );
      // clear the focus array in store
      dispatch(clearDispatch());
      // add the ellipse to focus array in store
      dispatch(addDispatch({ ids: [id] }));
      setMouseDownX(null);
      setMouseDownY(null);
      setCx(0);
      setCy(0);
      setRx(0);
      setRy(0);
    }
  }, [mouseIsUp, prevMouseIsUp, cx, cy, rx, ry]);

  useEffect(() => {
    if (mainMode.mode === "shape" && mainMode.subMode === "ellipse") {
      // register event listeners for the whole canvas, only in ellipse mode
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

  if (mainMode.mode === "shape" && mainMode.subMode === "ellipse") {
    return (
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        style={{ fill: "#FFFFFF", stroke: "#000000" }}
      />
    );
  } else {
    return null;
  }
}
