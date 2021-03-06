import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Tooltip } from "@mui/material";
import { pink } from "@mui/material/colors";
import { newDraw as newDrawDispatch } from "../redux/slices/drawEllipseSlice";
import {
  add as addDispatch,
  clear as clearDispatch,
} from "../redux/slices/shapeFocusSlice";
import { changeMode as changeModeDispatch } from "../redux/slices/mainModeSlice";
import {
  append as appendDispatch,
  replaceAll as replaceAllDispatch,
  replaceOne as replaceOneDispatch,
} from "../redux/slices/drawDataSlice";

const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

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

export default function DrawLiveEllipse() {
  const dispatch = useDispatch();
  // Main mode status
  const mainMode = useSelector((state) => state.mainMode);
  // The coordinates when mouse is clicked
  const [mouseDownX, setMouseDownX] = useState();
  const [mouseDownY, setMouseDownY] = useState();
  // The coordinates of the ellipse
  const [cx, setCx] = useState(0);
  const [cy, setCy] = useState(0);
  // The radii of the ellipse
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);
  // Flag state, true when mouse is up
  const [mouseIsUp, setMouseIsUp] = useState(true);
  // Previous mouse is up state
  const prevMouseIsUp = usePrevious(mouseIsUp);
  // tooltip shown when dragging and zooming
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  // Flag state to draw circle
  const [circleMode, setCircleMode] = useState(false);
  // Show or hide dock state
  const showDock = useSelector((state) => state.showDock);
  // Coordinates of mouse
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  // Window width and height statesbc
  const [windowWidth, windowHeight] = useWindowSize();

  /**
   * Mouse down event handler
   * @param {object} e mouse down event
   */
  const onMouseDown = (e) => {
    setMouseIsUp(false);
    // record the coordinates of the mouse click
    setMouseDownX(e.clientX);
    setMouseDownY(e.clientY);
    // set mode status to drawing to prevent dock from popping up
    dispatch(
      changeModeDispatch({
        mode: "shape",
        subMode: "ellipse",
        status: "drawing",
      })
    );
  };

  /**
   * Mouse move event handler
   * @param {object} e mouse move event
   */
  const onMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMouseX(clientX);
    setMouseY(clientY);
    setMouseDownX((mouseDownX) => {
      setMouseDownY((mouseDownY) => {
        if (mouseDownX && mouseDownY) {
          let rxComp;
          let ryComp;
          setCircleMode((circleMode) => {
            if (clientX > mouseDownX && clientY > mouseDownY) {
              rxComp = (clientX - mouseDownX) / 2;
              ryComp = (clientY - mouseDownY) / 2;
              setCx(mouseDownX + rxComp);
              setCy(mouseDownY + ryComp);
              if (circleMode) {
                const rMax = Math.max(rxComp, ryComp);
                setRx(rMax);
                setRy(rMax);
              } else {
                setRx(rxComp);
                setRy(ryComp);
              }
            } else if (clientX > mouseDownX) {
              rxComp = (clientX - mouseDownX) / 2;
              ryComp = (mouseDownY - clientY) / 2;
              setCx(mouseDownX + rxComp);
              setCy(clientY + ryComp);
              if (circleMode) {
                const rMax = Math.max(rxComp, ryComp);
                setRx(rMax);
                setRy(rMax);
              } else {
                setRx(rxComp);
                setRy(ryComp);
              }
            } else if (clientY > mouseDownY) {
              rxComp = (mouseDownX - clientX) / 2;
              ryComp = (clientY - mouseDownY) / 2;
              setCx(clientX + rxComp);
              setCy(mouseDownY + ryComp);
              if (circleMode) {
                const rMax = Math.max(rxComp, ryComp);
                setRx(rMax);
                setRy(rMax);
              } else {
                setRx(rxComp);
                setRy(ryComp);
              }
            } else {
              rxComp = (mouseDownX - clientX) / 2;
              ryComp = (mouseDownY - clientY) / 2;
              setCx(clientX + rxComp);
              setCy(clientY + ryComp);
              if (circleMode) {
                const rMax = Math.max(rxComp, ryComp);
                setRx(rMax);
                setRy(rMax);
              } else {
                setRx(rxComp);
                setRy(ryComp);
              }
            }
            setTooltipContent(
              <span>
                rX: {+rxComp.toFixed(2)}, rY: {+ryComp.toFixed(2)}
              </span>
            );
            setTooltipOpen(true);
            return circleMode;
          });
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
    setTooltipOpen(false);
    setTooltipContent("");
    setMouseIsUp(true);
    // set mode status back to null, so dock can slide
    dispatch(
      changeModeDispatch({
        mode: "shape",
        subMode: "ellipse",
        status: null,
      })
    );
  };

  /**
   * Callback for listening to keydown event
   * @param {object} event
   */
  const onKeyDown = (event) => {
    if (event.key === "Shift") {
      setCircleMode(true);
    }
  };

  /**
   * Callback for listening to keyup event
   * @param {object} event
   */
  const onKeyUp = (event) => {
    if (event.key === "Shift") {
      setCircleMode(false);
    }
  };

  useEffect(() => {
    // only fires at the moment of mouse up and at least one radius has to be non-zero
    if (mouseIsUp && !prevMouseIsUp && (rx || ry)) {
      const id = `ellipse-${uuidv4()}`;
      dispatch(
        appendDispatch({
          data: [
            {
              id,
              shape: "ellipse",
              positionX: cx,
              positionY: cy,
              radiusX: rx,
              radiusY: ry,
              deg: 0,
              code: `ellipse(${cx}, ${cy}, ${rx}, ${ry}, 0);`,
            },
          ],
        })
      );
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
    if (
      mainMode.mode === "shape" &&
      mainMode.subMode === "ellipse" &&
      ((!mouseIsUp &&
        showDock.show &&
        mouseX > windowWidth - 96 &&
        mouseY < 576) ||
        showDock.active)
    ) {
      // if click is within the dock, do not draw the ellipse
      setMouseIsUp(true);

      // set mode status back to null, so dock can slide
      dispatch(
        changeModeDispatch({
          mode: "shape",
          subMode: "ellipse",
          status: null,
        })
      );
      setMouseDownX(null);
      setMouseDownY(null);
      setCx(0);
      setCy(0);
      setRx(0);
      setRy(0);
    }
  }, [mainMode, mouseIsUp, showDock, mouseX, mouseY, windowWidth]);

  useEffect(() => {
    if (mainMode.mode === "shape" && mainMode.subMode === "ellipse") {
      // register event listeners for the whole canvas, only in ellipse mode
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
      return () => {
        document.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
      };
    } else {
      setMouseDownX(null);
      setMouseDownY(null);
    }
  }, [mainMode]);

  if (
    mainMode.mode === "shape" &&
    mainMode.subMode === "ellipse" &&
    (rx || ry)
  ) {
    return (
      <Fragment>
        <Tooltip open={tooltipOpen} title={tooltipContent}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            style={{ fill: "#FFFFFF", stroke: "#000000" }}
          />
        </Tooltip>
        {rx.toFixed() === ry.toFixed() && !mouseIsUp && (
          <line x1={cx} y1={cy} x2={cx} y2={cy - ry} stroke={pink[400]} />
        )}
        {rx.toFixed() === ry.toFixed() && !mouseIsUp && (
          <line x1={cx} y1={cy} x2={cx + rx} y2={cy} stroke={pink[400]} />
        )}
      </Fragment>
    );
  } else {
    return null;
  }
}
