import React, { useEffect, useRef, useState, Fragment } from "react";
import { Tooltip } from "@mui/material";
import { blue, pink } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  newDraw as newDrawDispatch,
  move as moveDispatch,
  zoom as zoomDispatch,
  rotate as rotateDispatch,
  liveUpdate as liveUpdateDispatch,
} from "../redux/slices/drawEllipseSlice";
import { changeMode as changeModeDispatch } from "../redux/slices/mainModeSlice";

const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

const DrawEllipse = ({ id, x, y, radiusX, radiusY, deg }) => {
  // current ellipse coordinates
  const [ellipseX, setEllipseX] = useState(x);
  const [ellipseY, setEllipseY] = useState(y);
  // ellipse coordinates before draggin or zooming
  const [prevEllipseX, setPrevEllipseX] = useState();
  const [prevEllipseY, setPrevEllipseY] = useState();
  // current ellipse radii
  const [radiusXCont, setRadiusXCont] = useState(radiusX);
  const [radiusYCont, setRadiusYCont] = useState(radiusY);
  // ellipse radii before zooming
  const [prevRadiusX, setPrevRadiusX] = useState();
  const [prevRadiusY, setPrevRadiusY] = useState();
  // current ellipse degree
  const [degCont, setDegCont] = useState(deg);
  // current reference rectangle coordinates
  const [rectX, setRectX] = useState(x - radiusX);
  const [rectY, setRectY] = useState(y - radiusY);
  // current control points coordinates
  const [controlX1, setControlX1] = useState(x - radiusX);
  const [controlY1, setControlY1] = useState(y - radiusY);
  const [controlX2, setControlX2] = useState(x);
  const [controlY2, setControlY2] = useState(y - radiusY);
  const [controlX3, setControlX3] = useState(x + radiusX);
  const [controlY3, setControlY3] = useState(y - radiusY);
  const [controlX4, setControlX4] = useState(x - radiusX);
  const [controlY4, setControlY4] = useState(y);
  const [controlX5, setControlX5] = useState(x + radiusX);
  const [controlY5, setControlY5] = useState(y);
  const [controlX6, setControlX6] = useState(x - radiusX);
  const [controlY6, setControlY6] = useState(y + radiusY);
  const [controlX7, setControlX7] = useState(x);
  const [controlY7, setControlY7] = useState(y + radiusY);
  const [controlX8, setControlX8] = useState(x + radiusX);
  const [controlY8, setControlY8] = useState(y + radiusY);
  // ratio x : y, used when shift key is down to keep ratio
  const [ratioXY, setRatioXY] = useState(0);
  // is true when mouse is down within rectangle, change to false when mouse is up
  const [dragging, setDragging] = useState(false);
  // previous dragging status, used to show notification when dragging is done
  const prevDragging = usePrevious(dragging);
  // set to true if shift key is done to keep x : y ratio
  const [keepRatio, setKeepRatio] = useState(false);
  // current zoom statuses for each control point
  const [zooming1, setZooming1] = useState(false);
  const [zooming2, setZooming2] = useState(false);
  const [zooming3, setZooming3] = useState(false);
  const [zooming4, setZooming4] = useState(false);
  const [zooming5, setZooming5] = useState(false);
  const [zooming6, setZooming6] = useState(false);
  const [zooming7, setZooming7] = useState(false);
  const [zooming8, setZooming8] = useState(false);
  // previous zoom statuses for each control point
  const prevZooming1 = usePrevious(zooming1);
  const prevZooming2 = usePrevious(zooming2);
  const prevZooming3 = usePrevious(zooming3);
  const prevZooming4 = usePrevious(zooming4);
  const prevZooming5 = usePrevious(zooming5);
  const prevZooming6 = usePrevious(zooming6);
  const prevZooming7 = usePrevious(zooming7);
  const prevZooming8 = usePrevious(zooming8);

  const dispatch = useDispatch();
  // shape stats statuses from redux store
  const ellipseStats = useSelector((state) => state.drawEllipse);
  // tooltip shown when dragging and zooming
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  // focus statuses from redux store
  const focusedShapes = useSelector((state) => state.shapeFocus.hasFocus);
  // Main mode status
  const mainMode = useSelector((state) => state.mainMode);
  // The current main mode, before dragging or zooming
  const [currMainMode, setCurrMainMode] = useState();

  /**
   * The callback function for listening mouse move on the whole screen
   * @param {object} e The mouse move event
   */
  const onMouseMove = (e) => {
    const { clientX, clientY } = e;
    setDragging((dragging) => {
      if (dragging) {
        setEllipseX(clientX);
        setEllipseY(clientY);
        setRadiusXCont((radiusXCont) => {
          setRectX(clientX - radiusXCont);
          setControlX1(clientX - radiusXCont);
          setControlX3(clientX + radiusXCont);
          setControlX4(clientX - radiusXCont);
          setControlX5(clientX + radiusXCont);
          setControlX6(clientX - radiusXCont);
          setControlX8(clientX + radiusXCont);
          return radiusXCont;
        });
        setRadiusYCont((radiusYCont) => {
          setRectY(clientY - radiusYCont);
          setControlY1(clientY - radiusYCont);
          setControlY2(clientY - radiusYCont);
          setControlY3(clientY - radiusYCont);
          setControlY6(clientY + radiusYCont);
          setControlY7(clientY + radiusYCont);
          setControlY8(clientY + radiusYCont);
          return radiusYCont;
        });
        setControlX2(clientX);
        setControlY4(clientY);
        setControlY5(clientY);
        setControlX7(clientX);
        return true;
      } else {
        return false;
      }
    });
    setZooming1((zooming1) => {
      if (zooming1) {
        setKeepRatio((keepRatio) => {
          if (keepRatio) {
            // When shift key is down, keep aspect ratio of circle
            setControlX8((controlX8) => {
              setControlY8((controlY8) => {
                const compX = Math.abs(controlX8 - clientX);
                const compY = Math.abs(controlY8 - clientY);
                setRatioXY((ratioXY) => {
                  let newRadiusX;
                  let newRadiusY;
                  if (compX < compY) {
                    newRadiusX = compX / 2;
                    newRadiusY = compX / 2 / ratioXY;
                  } else {
                    newRadiusY = compY / 2;
                    newRadiusX = (compY / 2) * ratioXY;
                  }
                  setRadiusYCont(newRadiusY);
                  setRadiusXCont(newRadiusX);
                  setEllipseX(
                    clientX > controlX8
                      ? controlX8 + newRadiusX
                      : controlX8 - newRadiusX
                  );
                  setEllipseY(
                    clientY > controlY8
                      ? controlY8 + newRadiusY
                      : controlY8 - newRadiusY
                  );
                  setRectX(
                    clientX > controlX8 ? controlX8 : controlX8 - 2 * newRadiusX
                  );
                  setRectY(
                    clientY > controlY8 ? controlY8 : controlY8 - 2 * newRadiusY
                  );
                  setControlX1(
                    clientX > controlX8
                      ? controlX8 + 2 * newRadiusX
                      : controlX8 - 2 * newRadiusX
                  );
                  setControlX4(
                    clientX > controlX8
                      ? controlX8 + 2 * newRadiusX
                      : controlX8 - 2 * newRadiusX
                  );
                  setControlX6(
                    clientX > controlX8
                      ? controlX8 + 2 * newRadiusX
                      : controlX8 - 2 * newRadiusX
                  );
                  setControlY1(
                    clientY > controlY8
                      ? controlY8 + 2 * newRadiusY
                      : controlY8 - 2 * newRadiusY
                  );
                  setControlX2(
                    clientX > controlX8
                      ? controlX8 + newRadiusX
                      : controlX8 - newRadiusX
                  );
                  setControlX7(
                    clientX > controlX8
                      ? controlX8 + newRadiusX
                      : controlX8 - newRadiusX
                  );
                  setControlY2(
                    clientY > controlY8
                      ? controlY8 + 2 * newRadiusY
                      : controlY8 - 2 * newRadiusY
                  );
                  setControlY3(
                    clientY > controlY8
                      ? controlY8 + 2 * newRadiusY
                      : controlY8 - 2 * newRadiusY
                  );
                  setControlY4(
                    clientY > controlY8
                      ? controlY8 + newRadiusY
                      : controlY8 - newRadiusY
                  );
                  setControlY5(
                    clientY > controlY8
                      ? controlY8 + newRadiusY
                      : controlY8 - newRadiusY
                  );
                  return ratioXY;
                });
                return controlY8;
              });
              return controlX8;
            });
            return true;
          } else {
            // Just change the shape
            setControlX3((controlX3) => {
              setEllipseX(Math.abs(clientX + (controlX3 - clientX) / 2));
              setRadiusXCont(Math.abs((controlX3 - clientX) / 2));
              setControlX2(Math.abs(clientX + (controlX3 - clientX) / 2));
              setControlX7(Math.abs(clientX + (controlX3 - clientX) / 2));
              setRectX(controlX3 - clientX < 0 ? controlX3 : clientX);
              return controlX3;
            });
            setControlY6((controlY6) => {
              setEllipseY(Math.abs(clientY + (controlY6 - clientY) / 2));
              setRadiusYCont(Math.abs((controlY6 - clientY) / 2));
              setControlY4(Math.abs(clientY + (controlY6 - clientY) / 2));
              setControlY5(Math.abs(clientY + (controlY6 - clientY) / 2));
              setRectY(controlY6 - clientY < 0 ? controlY6 : clientY);
              return controlY6;
            });
            setControlX1(clientX);
            setControlY1(clientY);
            setControlY2(clientY);
            setControlY3(clientY);
            setControlX4(clientX);
            setControlX6(clientX);
            return false;
          }
        });
        return true;
      } else {
        return false;
      }
    });
    setZooming2((zooming2) => {
      if (zooming2) {
        setKeepRatio((keepRatio) => {
          if (keepRatio) {
            setControlX7((controlX7) => {
              setControlY7((controlY7) => {
                const compY = Math.abs(controlY7 - clientY);
                setRatioXY((ratioXY) => {
                  const newRadiusY = compY / 2;
                  const newRadiusX = (compY / 2) * ratioXY;
                  setRadiusYCont(newRadiusY);
                  setRadiusXCont(newRadiusX);
                  setControlX1(controlX7 - newRadiusX);
                  setControlY1(clientY);
                  setControlY2(clientY);
                  setControlX3(controlX7 + newRadiusX);
                  setControlY3(clientY);
                  setControlX4(controlX7 - newRadiusX);
                  setControlY4(
                    clientY > controlY7
                      ? controlY7 + newRadiusY
                      : controlY7 - newRadiusY
                  );
                  setControlX5(controlX7 + newRadiusX);
                  setControlY5(
                    clientY > controlY7
                      ? controlY7 + newRadiusY
                      : controlY7 - newRadiusY
                  );
                  setControlX6(controlX7 - newRadiusX);
                  setControlX8(controlX7 + newRadiusX);
                  setEllipseY(
                    clientY > controlY7
                      ? controlY7 + newRadiusY
                      : controlY7 - newRadiusY
                  );
                  setRectX(controlX7 - newRadiusX);
                  setRectY(clientY > controlY7 ? controlY7 : clientY);
                  return ratioXY;
                });
                return controlY7;
              });
              return controlX7;
            });
            return true;
          } else {
            setControlY2(clientY);
            setControlY1(clientY);
            setControlY3(clientY);
            setControlY6((controlY6) => {
              setControlY4(Math.abs(clientY + (controlY6 - clientY) / 2));
              setControlY5(Math.abs(clientY + (controlY6 - clientY) / 2));
              setRectY(controlY6 - clientY < 0 ? controlY6 : clientY);
              setRadiusYCont(Math.abs((controlY6 - clientY) / 2));
              setEllipseY(Math.abs(clientY + (controlY6 - clientY) / 2));
              return controlY6;
            });
            return false;
          }
        });
        return true;
      } else {
        return false;
      }
    });
    setZooming3((zooming3) => {
      if (zooming3) {
        setKeepRatio((keepRatio) => {
          if (keepRatio) {
            setControlX6((controlX6) => {
              setControlY6((controlY6) => {
                const compX = Math.abs(clientX - controlX6);
                const compY = Math.abs(controlY6 - clientY);
                setRatioXY((ratioXY) => {
                  let newRadiusX;
                  let newRadiusY;
                  if (compX < compY) {
                    newRadiusX = compX / 2;
                    newRadiusY = compX / 2 / ratioXY;
                  } else {
                    newRadiusY = compY / 2;
                    newRadiusX = (compY / 2) * ratioXY;
                  }
                  setRadiusYCont(newRadiusY);
                  setRadiusXCont(newRadiusX);
                  setEllipseX(
                    clientX > controlX6
                      ? controlX6 + newRadiusX
                      : controlX6 - newRadiusX
                  );
                  setEllipseY(
                    clientY < controlY6
                      ? controlY6 - newRadiusY
                      : controlY6 + newRadiusY
                  );
                  setRectX(
                    clientX > controlX6 ? controlX6 : controlX6 - 2 * newRadiusX
                  );
                  setRectY(
                    clientY < controlY6 ? controlY6 - 2 * newRadiusY : controlY6
                  );
                  setControlY1(
                    clientY < controlY6
                      ? controlY6 - 2 * newRadiusY
                      : controlY6 + 2 * newRadiusY
                  );
                  setControlX2(
                    clientX > controlX6
                      ? controlX6 + newRadiusX
                      : controlX6 - newRadiusX
                  );
                  setControlY2(
                    clientY < controlY6
                      ? controlY6 - 2 * newRadiusY
                      : controlY6 + 2 * newRadiusY
                  );
                  setControlX3(
                    clientX > controlX6
                      ? controlX6 + 2 * newRadiusX
                      : controlX6 - 2 * newRadiusX
                  );
                  setControlY3(
                    clientY < controlY6
                      ? controlY6 - 2 * newRadiusY
                      : controlY6 + 2 * newRadiusY
                  );
                  setControlY4(
                    clientY < controlY6
                      ? controlY6 - newRadiusY
                      : controlY6 + newRadiusY
                  );
                  setControlX5(
                    clientX > controlX6
                      ? controlX6 + 2 * newRadiusX
                      : controlX6 - 2 * newRadiusX
                  );
                  setControlY5(
                    clientY < controlY6
                      ? controlY6 - newRadiusY
                      : controlY6 + newRadiusY
                  );
                  setControlX7(
                    clientX > controlX6
                      ? controlX6 + newRadiusX
                      : controlX6 - newRadiusX
                  );
                  setControlX8(
                    clientX > controlX6
                      ? controlX6 + 2 * newRadiusX
                      : controlX6 - 2 * newRadiusX
                  );
                  return ratioXY;
                });
                return controlY6;
              });
              return controlX6;
            });
            return true;
          } else {
            setControlX3(clientX);
            setControlY3(clientY);
            setControlY1(clientY);
            setControlY2(clientY);
            setControlX1((controlX1) => {
              setControlX2(Math.abs(clientX - (clientX - controlX1) / 2));
              setRadiusXCont(Math.abs((clientX - controlX1) / 2));
              setEllipseX(Math.abs(clientX - (clientX - controlX1) / 2));
              setControlX7(Math.abs(clientX - (clientX - controlX1) / 2));
              setRectX(clientX - controlX1 < 0 ? clientX : controlX1);
              return controlX1;
            });
            setControlY6((controlY6) => {
              setRadiusYCont(Math.abs((controlY6 - clientY) / 2));
              setEllipseY(Math.abs(clientY + (controlY6 - clientY) / 2));
              setControlY4(Math.abs(clientY + (controlY6 - clientY) / 2));
              setControlY5(Math.abs(clientY + (controlY6 - clientY) / 2));
              setRectY(controlY6 - clientY < 0 ? controlY6 : clientY);
              return controlY6;
            });
            setControlX5(clientX);
            setControlX8(clientX);
            return false;
          }
        });
        return true;
      } else {
        return false;
      }
    });
    setZooming4((zooming4) => {
      if (zooming4) {
        setKeepRatio((keepRatio) => {
          if (keepRatio) {
            setControlX5((controlX5) => {
              setControlY5((controlY5) => {
                const compX = Math.abs(controlX5 - clientX);
                setRatioXY((ratioXY) => {
                  const newRadiusX = compX / 2;
                  const newRadiusY = compX / 2 / ratioXY;
                  setRadiusXCont(newRadiusX);
                  setRadiusYCont(newRadiusY);
                  setControlX1(clientX);
                  setControlY1(controlY5 - newRadiusY);
                  setControlX2(
                    clientX < controlX5
                      ? controlX5 - newRadiusX
                      : controlX5 + newRadiusX
                  );
                  setControlY2(controlY5 - newRadiusY);
                  setControlY3(controlY5 - newRadiusY);
                  setControlX4(clientX);
                  setControlX6(clientX);
                  setControlY6(controlY5 + newRadiusY);
                  setControlX7(
                    clientX < controlX5
                      ? controlX5 - newRadiusX
                      : controlX5 + newRadiusX
                  );
                  setControlY7(controlY5 + newRadiusY);
                  setControlY8(controlY5 + newRadiusY);
                  setEllipseX(
                    clientX < controlX5
                      ? controlX5 - newRadiusX
                      : controlX5 + newRadiusX
                  );
                  setRectX(clientX < controlX5 ? clientX : controlX5);
                  setRectY(controlY5 - newRadiusY);
                  return ratioXY;
                });
                return controlY5;
              });
              return controlX5;
            });
            return true;
          } else {
            setControlX4(clientX);
            setControlX1(clientX);
            setControlX6(clientX);
            setControlX3((controlX3) => {
              setControlX2(Math.abs((controlX3 - clientX) / 2 + clientX));
              setControlX7(Math.abs((controlX3 - clientX) / 2 + clientX));
              setEllipseX(Math.abs((controlX3 - clientX) / 2 + clientX));
              setRadiusXCont(Math.abs((controlX3 - clientX) / 2));
              setRectX(controlX3 - clientX < 0 ? controlX3 : clientX);
              return controlX3;
            });
            return false;
          }
        });
        return true;
      } else {
        return false;
      }
    });
    setZooming5((zooming5) => {
      if (zooming5) {
        setKeepRatio((keepRatio) => {
          if (keepRatio) {
            setControlX4((controlX4) => {
              setControlY4((controlY4) => {
                const compX = Math.abs(clientX - controlX4);
                setRatioXY((ratioXY) => {
                  const newRadiusX = compX / 2;
                  const newRadiusY = compX / 2 / ratioXY;
                  setRadiusXCont(newRadiusX);
                  setRadiusYCont(newRadiusY);
                  setControlY1(controlY4 - newRadiusY);
                  setControlX2(
                    clientX > controlX4
                      ? controlX4 + newRadiusX
                      : controlX4 - newRadiusX
                  );
                  setControlY2(controlY4 - newRadiusY);
                  setControlX3(clientX);
                  setControlY3(controlY4 - newRadiusY);
                  setControlX5(clientX);
                  setControlY6(controlY4 + newRadiusY);
                  setControlX7(
                    clientX > controlX4
                      ? controlX4 + newRadiusX
                      : controlX4 - newRadiusX
                  );
                  setControlY7(controlY4 + newRadiusY);
                  setControlX8(clientX);
                  setControlY8(controlY4 + newRadiusY);
                  setEllipseX(
                    clientX > controlX4
                      ? controlX4 + newRadiusX
                      : controlX4 - newRadiusX
                  );
                  setRectX(clientX > controlX4 ? controlX4 : clientX);
                  setRectY(controlY4 - newRadiusY);
                  return ratioXY;
                });
                return controlY4;
              });
              return controlX4;
            });
            return true;
          } else {
            setControlX5(clientX);
            setControlX3(clientX);
            setControlX8(clientX);
            setControlX1((controlX1) => {
              setControlX2(Math.abs((clientX - controlX1) / 2 + controlX1));
              setControlX7(Math.abs((clientX - controlX1) / 2 + controlX1));
              setEllipseX(Math.abs((clientX - controlX1) / 2 + controlX1));
              setRadiusXCont(Math.abs((clientX - controlX1) / 2));
              setRectX(clientX - controlX1 < 0 ? clientX : controlX1);
              return controlX1;
            });
            return false;
          }
        });
        return true;
      } else {
        return false;
      }
    });
    setZooming6((zooming6) => {
      if (zooming6) {
        setKeepRatio((keepRatio) => {
          if (keepRatio) {
            setControlX3((controlX3) => {
              setControlY3((controlY3) => {
                const compX = Math.abs(controlX3 - clientX);
                const compY = Math.abs(clientY - controlY3);
                setRatioXY((ratioXY) => {
                  let newRadiusX;
                  let newRadiusY;
                  if (compX < compY) {
                    newRadiusX = compX / 2;
                    newRadiusY = compX / 2 / ratioXY;
                  } else {
                    newRadiusY = compY / 2;
                    newRadiusX = (compY / 2) * ratioXY;
                  }
                  setRadiusYCont(newRadiusY);
                  setRadiusXCont(newRadiusX);
                  setEllipseX(
                    clientX < controlX3
                      ? controlX3 - newRadiusX
                      : controlX3 + newRadiusX
                  );
                  setEllipseY(
                    clientY > controlY3
                      ? controlY3 + newRadiusY
                      : controlY3 - newRadiusY
                  );
                  setControlX1(
                    clientX < controlX3
                      ? controlX3 - 2 * newRadiusX
                      : controlX3 + 2 * newRadiusX
                  );
                  setControlX2(
                    clientX < controlX3
                      ? controlX3 - newRadiusX
                      : controlX3 + newRadiusX
                  );
                  setControlX4(
                    clientX < controlX3
                      ? controlX3 - 2 * newRadiusX
                      : controlX3 + 2 * newRadiusX
                  );
                  setControlY4(
                    clientY > controlY3
                      ? controlY3 + newRadiusY
                      : controlY3 - newRadiusY
                  );
                  setControlY5(
                    clientY > controlY3
                      ? controlY3 + newRadiusY
                      : controlY3 - newRadiusY
                  );
                  setControlX6(
                    clientX < controlX3
                      ? controlX3 - 2 * newRadiusX
                      : controlX3 + 2 * newRadiusX
                  );
                  setControlY6(
                    clientY > controlY3
                      ? controlY3 + 2 * newRadiusY
                      : controlY3 - 2 * newRadiusY
                  );
                  setControlX7(
                    clientX < controlX3
                      ? controlX3 - newRadiusX
                      : controlX3 + newRadiusX
                  );
                  setControlY7(
                    clientY > controlY3
                      ? controlY3 + 2 * newRadiusY
                      : controlY3 - 2 * newRadiusY
                  );
                  setControlY8(
                    clientY > controlY3
                      ? controlY3 + 2 * newRadiusY
                      : controlY3 - 2 * newRadiusY
                  );
                  setRectX(
                    clientX < controlX3 ? controlX3 - 2 * newRadiusX : controlX3
                  );
                  setRectY(
                    clientY > controlY3 ? controlY3 : controlY3 - 2 * newRadiusY
                  );
                  return ratioXY;
                });
                return controlY3;
              });
              return controlX3;
            });
            return true;
          } else {
            setControlX6(clientX);
            setControlY6(clientY);
            setControlX1(clientX);
            setControlX4(clientX);
            setControlY1((controlY1) => {
              setControlY4(Math.abs(clientY - (clientY - controlY1) / 2));
              setControlY5(Math.abs(clientY - (clientY - controlY1) / 2));
              setRectY(clientY - controlY1 < 0 ? clientY : controlY1);
              setEllipseY(Math.abs(clientY - (clientY - controlY1) / 2));
              setRadiusYCont(Math.abs((clientY - controlY1) / 2));
              return controlY1;
            });
            setControlX3((controlX3) => {
              setControlX2(Math.abs(clientX + (controlX3 - clientX) / 2));
              setControlX7(Math.abs(clientX + (controlX3 - clientX) / 2));
              setRectX(controlX3 - clientX < 0 ? controlX3 : clientX);
              setEllipseX(Math.abs(clientX + (controlX3 - clientX) / 2));
              setRadiusXCont(Math.abs((controlX3 - clientX) / 2));
              return controlX3;
            });
            setControlY7(clientY);
            setControlY8(clientY);
            return false;
          }
        });
        return true;
      } else {
        return false;
      }
    });
    setZooming7((zooming7) => {
      if (zooming7) {
        setKeepRatio((keepRatio) => {
          if (keepRatio) {
            setControlX2((controlX2) => {
              setControlY2((controlY2) => {
                const compY = Math.abs(clientY - controlY2);
                setRatioXY((ratioXY) => {
                  const newRadiusY = compY / 2;
                  const newRadiusX = (compY / 2) * ratioXY;
                  setRadiusYCont(newRadiusY);
                  setRadiusXCont(newRadiusX);
                  setEllipseY(
                    clientY > controlY2
                      ? controlY2 + newRadiusY
                      : controlY2 - newRadiusY
                  );
                  setControlX1(controlX2 - newRadiusX);
                  setControlX3(controlX2 + newRadiusX);
                  setControlX4(controlX2 - newRadiusX);
                  setControlY4(
                    clientY > controlY2
                      ? controlY2 + newRadiusY
                      : controlY2 - newRadiusY
                  );
                  setControlX5(controlX2 + newRadiusX);
                  setControlY5(
                    clientY > controlY2
                      ? controlY2 + newRadiusY
                      : controlY2 - newRadiusY
                  );
                  setControlX6(controlX2 - newRadiusX);
                  setControlY6(
                    clientY > controlY2
                      ? controlY2 + 2 * newRadiusY
                      : controlY2 - 2 * newRadiusY
                  );
                  setControlY7(
                    clientY > controlY2
                      ? controlY2 + 2 * newRadiusY
                      : controlY2 - 2 * newRadiusY
                  );
                  setControlX8(controlX2 + newRadiusX);
                  setControlY8(
                    clientY > controlY2
                      ? controlY2 + 2 * newRadiusY
                      : controlY2 - 2 * newRadiusY
                  );
                  setRectX(controlX2 - newRadiusX);
                  setRectY(
                    clientY > controlY2 ? controlY2 : controlY2 - 2 * newRadiusY
                  );
                  return ratioXY;
                });
                return controlY2;
              });
              return controlX2;
            });
            return true;
          } else {
            setControlY7(clientY);
            setControlY6(clientY);
            setControlY8(clientY);
            setControlY1((controlY1) => {
              setControlY4(Math.abs(clientY - (clientY - controlY1) / 2));
              setControlY5(Math.abs(clientY - (clientY - controlY1) / 2));
              setEllipseY(Math.abs(clientY - (clientY - controlY1) / 2));
              setRectY(clientY - controlY1 < 0 ? clientY : controlY1);
              setRadiusYCont(Math.abs((clientY - controlY1) / 2));
              return controlY1;
            });
            return false;
          }
        });
        return true;
      } else {
        return false;
      }
    });
    setZooming8((zooming8) => {
      if (zooming8) {
        setKeepRatio((keepRatio) => {
          if (keepRatio) {
            setControlX1((controlX1) => {
              setControlY1((controlY1) => {
                const compX = Math.abs(clientX - controlX1);
                const compY = Math.abs(clientY - controlY1);
                setRatioXY((ratioXY) => {
                  let newRadiusX;
                  let newRadiusY;
                  if (compX < compY) {
                    newRadiusX = compX / 2;
                    newRadiusY = compX / 2 / ratioXY;
                  } else {
                    newRadiusY = compY / 2;
                    newRadiusX = (compY / 2) * ratioXY;
                  }
                  setRadiusYCont(newRadiusY);
                  setRadiusXCont(newRadiusX);
                  setEllipseX(
                    clientX > controlX1
                      ? controlX1 + newRadiusX
                      : controlX1 - newRadiusX
                  );
                  setEllipseY(
                    clientY > controlY1
                      ? controlY1 + newRadiusY
                      : controlY1 - newRadiusY
                  );
                  setControlX2(
                    clientX > controlX1
                      ? controlX1 + newRadiusX
                      : controlX1 - newRadiusX
                  );
                  setControlX3(
                    clientX > controlX1
                      ? controlX1 + 2 * newRadiusX
                      : controlX1 - 2 * newRadiusX
                  );
                  setControlY4(
                    clientY > controlY1
                      ? controlY1 + newRadiusY
                      : controlY1 - newRadiusY
                  );
                  setControlX5(
                    clientX > controlX1
                      ? controlX1 + 2 * newRadiusX
                      : controlX1 - 2 * newRadiusX
                  );
                  setControlY5(
                    clientY > controlY1
                      ? controlY1 + newRadiusY
                      : controlY1 - newRadiusY
                  );
                  setControlY6(
                    clientY > controlY1
                      ? controlY1 + 2 * newRadiusY
                      : controlY1 - 2 * newRadiusY
                  );
                  setControlX7(
                    clientX > controlX1
                      ? controlX1 + newRadiusX
                      : controlX1 - newRadiusX
                  );
                  setControlY7(
                    clientY > controlY1
                      ? controlY1 + 2 * newRadiusY
                      : controlY1 - 2 * newRadiusY
                  );
                  setControlX8(
                    clientX > controlX1
                      ? controlX1 + 2 * newRadiusX
                      : controlX1 - 2 * newRadiusX
                  );
                  setControlY8(
                    clientY > controlY1
                      ? controlY1 + 2 * newRadiusY
                      : controlY1 - 2 * newRadiusY
                  );
                  setRectX(
                    clientX > controlX1 ? controlX1 : controlX1 - 2 * newRadiusX
                  );
                  setRectY(
                    clientY > controlY1 ? controlY1 : controlY1 - 2 * newRadiusY
                  );
                  return ratioXY;
                });
                return controlY1;
              });
              return controlX1;
            });
            return true;
          } else {
            setControlX8(clientX);
            setControlY8(clientY);
            setControlX3(clientX);
            setControlX5(clientX);
            setControlY6(clientY);
            setControlY7(clientY);
            setControlX1((controlX1) => {
              setRectX(clientX - controlX1 < 0 ? clientX : controlX1);
              setControlX2(Math.abs(clientX - (clientX - controlX1) / 2));
              setControlX7(Math.abs(clientX - (clientX - controlX1) / 2));
              setEllipseX(Math.abs(clientX - (clientX - controlX1) / 2));
              setRadiusXCont(Math.abs((clientX - controlX1) / 2));
              return controlX1;
            });
            setControlY3((controlY3) => {
              setRectY(clientY - controlY3 < 0 ? clientY : controlY3);
              setControlY4(Math.abs(clientY - (clientY - controlY3) / 2));
              setControlY5(Math.abs(clientY - (clientY - controlY3) / 2));
              setEllipseY(Math.abs(clientY - (clientY - controlY3) / 2));
              setRadiusYCont(Math.abs((clientY - controlY3) / 2));
              return controlY3;
            });
            return false;
          }
        });
        return true;
      } else {
        return false;
      }
    });
  };

  /**
   * Mouse up callback
   */
  const onMouseUp = () => {
    // Stop zooming once mouse is up. This one is necessary for control point 2, 4, 5, and 7 because mouse might move out of the control point during zooming
    // This is also necessary for all points when shift key is down
    setZooming1(false);
    setZooming2(false);
    setZooming3(false);
    setZooming4(false);
    setZooming5(false);
    setZooming6(false);
    setZooming7(false);
    setZooming8(false);
  };

  /**
   * Callback for listening to keydown event
   * @param {object} event
   */
  const onKeyDown = (event) => {
    if (event.key === "Shift") {
      setKeepRatio(true);
    }
  };

  /**
   * Callback for listening to keyup event
   * @param {object} event
   */
  const onKeyUp = (event) => {
    if (event.key === "Shift") {
      setKeepRatio(false);
    }
  };

  useEffect(() => {
    // register event listeners
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    // update ratio x : y
    if (radiusYCont > 0) setRatioXY(radiusXCont / radiusYCont);
  }, [radiusXCont, radiusYCont]);

  useEffect(() => {
    if (!dragging && prevDragging) {
      // close tooltip
      setTooltipOpen(false);
      // dispatch state to show snackbar info
      dispatch(
        moveDispatch({
          id,
          x: ellipseX,
          y: ellipseY,
          xDiff: ellipseX - prevEllipseX,
          yDiff: ellipseY - prevEllipseY,
        })
      );
      // switch back to current main mode
      dispatch(
        changeModeDispatch({
          mode: currMainMode.mode,
          subMode: currMainMode.subMode,
          status: currMainMode.status,
        })
      );
    }
  }, [dragging, prevDragging, ellipseX, ellipseY]);

  useEffect(() => {
    // dispatch shape data when dragging
    if (dragging) {
      dispatch(
        liveUpdateDispatch({
          id,
          mode: "liveMove",
          x: ellipseX,
          y: ellipseY,
          xDiff: ellipseX - prevEllipseX,
          yDiff: ellipseY - prevEllipseY,
          rx: radiusXCont,
          ry: radiusYCont,
          deg: degCont,
          rxDiff: 0,
          ryDiff: 0,
          degDiff: 0,
        })
      );
    }
  }, [dragging, ellipseX, ellipseY]);

  useEffect(() => {
    if (
      (!zooming1 && prevZooming1) ||
      (!zooming2 && prevZooming2) ||
      (!zooming3 && prevZooming3) ||
      (!zooming4 && prevZooming4) ||
      (!zooming5 && prevZooming5) ||
      (!zooming6 && prevZooming6) ||
      (!zooming7 && prevZooming7) ||
      (!zooming8 && prevZooming8)
    ) {
      // close tooltip
      setTooltipOpen(false);
      // dispatch state to show snackbar info
      dispatch(
        zoomDispatch({
          id,
          x: ellipseX,
          y: ellipseY,
          xDiff: ellipseX - prevEllipseX,
          yDiff: ellipseY - prevEllipseY,
          rx: radiusXCont,
          ry: radiusYCont,
          rxDiff: radiusXCont - prevRadiusX,
          ryDiff: radiusYCont - prevRadiusY,
        })
      );
      // switch back to current main mode
      dispatch(
        changeModeDispatch({
          mode: currMainMode.mode,
          subMode: currMainMode.subMode,
          status: currMainMode.status,
        })
      );
    }
  }, [
    zooming1,
    zooming2,
    zooming3,
    zooming4,
    zooming5,
    zooming6,
    zooming7,
    zooming8,
    prevZooming1,
    prevZooming2,
    prevZooming3,
    prevZooming4,
    prevZooming5,
    prevZooming6,
    prevZooming7,
    prevZooming8,
    ellipseX,
    ellipseY,
    radiusXCont,
    radiusYCont,
  ]);

  useEffect(() => {
    if (
      zooming1 ||
      zooming2 ||
      zooming3 ||
      zooming4 ||
      zooming5 ||
      zooming6 ||
      zooming7 ||
      zooming8
    ) {
      // dispatch shape data when zooming
      dispatch(
        liveUpdateDispatch({
          id,
          mode: "liveZoom",
          x: ellipseX,
          y: ellipseY,
          xDiff: ellipseX - prevEllipseX,
          yDiff: ellipseY - prevEllipseY,
          rx: radiusXCont,
          ry: radiusYCont,
          rxDiff: radiusXCont - prevRadiusX,
          ryDiff: radiusYCont - prevRadiusY,
          deg: degCont,
          degDiff: 0,
        })
      );
    }
  }, [
    zooming1,
    zooming2,
    zooming3,
    zooming4,
    zooming5,
    zooming6,
    zooming7,
    zooming8,
    ellipseX,
    ellipseY,
    radiusXCont,
    radiusYCont,
  ]);

  useEffect(() => {
    // subscribe to tooltip data changes
    const {
      id: currId,
      mode,
      x,
      y,
      rx,
      ry,
      deg,
      xDiff,
      yDiff,
      rxDiff,
      ryDiff,
      degDiff,
    } = ellipseStats;
    if (
      currId === id &&
      (x ||
        y ||
        rx ||
        ry ||
        deg ||
        xDiff ||
        yDiff ||
        rxDiff ||
        ryDiff ||
        degDiff)
    ) {
      switch (mode) {
        case "liveMove":
          setTooltipContent(
            <span>
              xDiff: {+xDiff.toFixed(2)}, yDiff: {+yDiff.toFixed(2)}
            </span>
          );
          setTooltipOpen(true);
          break;
        case "liveZoom":
          setTooltipContent(
            <span>
              rX: {+rx.toFixed(2)}, rY: {+ry.toFixed(2)}
            </span>
          );
          setTooltipOpen(true);
          break;
        default:
      }
    }
  }, [ellipseStats]);

  return (
    <Fragment>
      <ellipse
        cx={ellipseX}
        cy={ellipseY}
        rx={radiusXCont}
        ry={radiusYCont}
        style={{ fill: "#FFFFFF", stroke: "#000000" }}
        // onMouseDown={(e) => {
        //   dispatch(addDispatch({ ids: [id] }));
        // }}
      />
      {focusedShapes.includes(id) ? (
        <Fragment>
          {radiusXCont.toFixed() === radiusYCont.toFixed() &&
            (zooming1 ||
              zooming2 ||
              zooming3 ||
              zooming4 ||
              zooming5 ||
              zooming6 ||
              zooming7 ||
              zooming8) && (
              <line
                x1={ellipseX}
                y1={ellipseY}
                x2={controlX2}
                y2={controlY2}
                stroke={pink[400]}
              />
            )}
          {radiusXCont.toFixed() === radiusYCont.toFixed() &&
            (zooming1 ||
              zooming2 ||
              zooming3 ||
              zooming4 ||
              zooming5 ||
              zooming6 ||
              zooming7 ||
              zooming8) && (
              <line
                x1={ellipseX}
                y1={ellipseY}
                x2={controlX5}
                y2={controlY5}
                stroke={pink[400]}
              />
            )}
          <Tooltip open={tooltipOpen} title={tooltipContent}>
            <rect
              x={rectX}
              y={rectY}
              width={radiusXCont * 2}
              height={radiusYCont * 2}
              style={{
                fill: "transparent",
                stroke: blue[400],
                cursor:
                  mainMode.mode === "select" || mainMode.mode === "animate"
                    ? "grab"
                    : "inherit",
              }}
              onMouseDown={(e) => {
                if (mainMode.mode === "select" || mainMode.mode === "animate") {
                  setDragging(true);
                  setPrevEllipseX(ellipseX);
                  setPrevEllipseY(ellipseY);
                  // Record current mode and switch to dragging mode
                  setCurrMainMode(mainMode);
                  dispatch(changeModeDispatch({ mode: "dragging" }));
                }
              }}
              onMouseUp={(e) => {
                setDragging(false);
              }}
            />
          </Tooltip>
          <circle
            cx={controlX1}
            cy={controlY1}
            r='4'
            style={{ fill: blue[400], cursor: "nwse-resize" }}
            onMouseDown={(e) => {
              setZooming1(true);
              setPrevEllipseX(ellipseX);
              setPrevEllipseY(ellipseY);
              setPrevRadiusX(radiusXCont);
              setPrevRadiusY(radiusYCont);
              // Record current mode and switch to zooming mode
              setCurrMainMode(mainMode);
              dispatch(changeModeDispatch({ mode: "zooming" }));
            }}
            onMouseUp={(e) => {
              setZooming1(false);
            }}
          />
          <circle
            cx={controlX2}
            cy={controlY2}
            r='4'
            style={{ fill: blue[400], cursor: "ns-resize" }}
            onMouseDown={(e) => {
              setZooming2(true);
              setPrevEllipseX(ellipseX);
              setPrevEllipseY(ellipseY);
              setPrevRadiusX(radiusXCont);
              setPrevRadiusY(radiusYCont);
              // Record current mode and switch to zooming mode
              setCurrMainMode(mainMode);
              dispatch(changeModeDispatch({ mode: "zooming" }));
            }}
            onMouseUp={(e) => {
              setZooming2(false);
            }}
          />
          <circle
            cx={controlX3}
            cy={controlY3}
            r='4'
            style={{ fill: blue[400], cursor: "nesw-resize" }}
            onMouseDown={(e) => {
              setZooming3(true);
              setPrevEllipseX(ellipseX);
              setPrevEllipseY(ellipseY);
              setPrevRadiusX(radiusXCont);
              setPrevRadiusY(radiusYCont);
              // Record current mode and switch to zooming mode
              setCurrMainMode(mainMode);
              dispatch(changeModeDispatch({ mode: "zooming" }));
            }}
            onMouseUp={(e) => {
              setZooming3(false);
            }}
          />
          <circle
            cx={controlX4}
            cy={controlY4}
            r='4'
            style={{ fill: blue[400], cursor: "ew-resize" }}
            onMouseDown={(e) => {
              setZooming4(true);
              setPrevEllipseX(ellipseX);
              setPrevEllipseY(ellipseY);
              setPrevRadiusX(radiusXCont);
              setPrevRadiusY(radiusYCont);
              // Record current mode and switch to zooming mode
              setCurrMainMode(mainMode);
              dispatch(changeModeDispatch({ mode: "zooming" }));
            }}
            onMouseUp={(e) => {
              setZooming4(false);
            }}
          />
          <circle
            cx={controlX5}
            cy={controlY5}
            r='4'
            style={{ fill: blue[400], cursor: "ew-resize" }}
            onMouseDown={(e) => {
              setZooming5(true);
              setPrevEllipseX(ellipseX);
              setPrevEllipseY(ellipseY);
              setPrevRadiusX(radiusXCont);
              setPrevRadiusY(radiusYCont);
              // Record current mode and switch to zooming mode
              setCurrMainMode(mainMode);
              dispatch(changeModeDispatch({ mode: "zooming" }));
            }}
            onMouseUp={(e) => {
              setZooming5(false);
            }}
          />
          <circle
            cx={controlX6}
            cy={controlY6}
            r='4'
            style={{ fill: blue[400], cursor: "nesw-resize" }}
            onMouseDown={(e) => {
              setZooming6(true);
              setPrevEllipseX(ellipseX);
              setPrevEllipseY(ellipseY);
              setPrevRadiusX(radiusXCont);
              setPrevRadiusY(radiusYCont);
              // Record current mode and switch to zooming mode
              setCurrMainMode(mainMode);
              dispatch(changeModeDispatch({ mode: "zooming" }));
            }}
            onMouseUp={(e) => {
              setZooming6(false);
            }}
          />
          <circle
            cx={controlX7}
            cy={controlY7}
            r='4'
            style={{ fill: blue[400], cursor: "ns-resize" }}
            onMouseDown={(e) => {
              setZooming7(true);
              setPrevEllipseX(ellipseX);
              setPrevEllipseY(ellipseY);
              setPrevRadiusX(radiusXCont);
              setPrevRadiusY(radiusYCont);
              // Record current mode and switch to zooming mode
              setCurrMainMode(mainMode);
              dispatch(changeModeDispatch({ mode: "zooming" }));
            }}
            onMouseUp={(e) => {
              setZooming7(false);
            }}
          />
          <circle
            cx={controlX8}
            cy={controlY8}
            r='4'
            style={{ fill: blue[400], cursor: "nwse-resize" }}
            onMouseDown={(e) => {
              setZooming8(true);
              setPrevEllipseX(ellipseX);
              setPrevEllipseY(ellipseY);
              setPrevRadiusX(radiusXCont);
              setPrevRadiusY(radiusYCont);
              // Record current mode and switch to zooming mode
              setCurrMainMode(mainMode);
              dispatch(changeModeDispatch({ mode: "zooming" }));
            }}
            onMouseUp={(e) => {
              setZooming8(false);
            }}
          />
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default DrawEllipse;
