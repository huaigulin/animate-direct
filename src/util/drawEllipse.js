import React, { useEffect, useState, Fragment } from "react";
import { blue } from "@mui/material/colors";

const DrawEllipse = ({ x, y, radiusX, radiusY }) => {
  const [ellipseX, setEllipseX] = useState(x);
  const [ellipseY, setEllipseY] = useState(y);
  const [radiusXCont, setRadiusXCont] = useState(radiusX);
  const [radiusYCont, setRadiusYCont] = useState(radiusY);
  const [rectX, setRectX] = useState(x - radiusX);
  const [rectY, setRectY] = useState(y - radiusY);
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
  const [dragging, setDragging] = useState(false);
  const [zooming1, setZooming1] = useState(false);
  const [zooming2, setZooming2] = useState(false);
  const [zooming3, setZooming3] = useState(false);
  const [zooming4, setZooming4] = useState(false);
  const [zooming5, setZooming5] = useState(false);
  const [zooming6, setZooming6] = useState(false);
  const [zooming7, setZooming7] = useState(false);
  const [zooming8, setZooming8] = useState(false);

  /**
   * The callback function for listening mouse move on the whole screen
   * @param {object} e The mouse move event
   */
  const onMouseMove = (e) => {
    setDragging((dragging) => {
      if (dragging) {
        setEllipseX(e.clientX);
        setEllipseY(e.clientY);
        setRadiusXCont((radiusXCont) => {
          setRectX(e.clientX - radiusXCont);
          setControlX1(e.clientX - radiusXCont);
          setControlX3(e.clientX + radiusXCont);
          setControlX4(e.clientX - radiusXCont);
          setControlX5(e.clientX + radiusXCont);
          setControlX6(e.clientX - radiusXCont);
          setControlX8(e.clientX + radiusXCont);
          return radiusXCont;
        });
        setRadiusYCont((radiusYCont) => {
          setRectY(e.clientY - radiusYCont);
          setControlY1(e.clientY - radiusYCont);
          setControlY2(e.clientY - radiusYCont);
          setControlY3(e.clientY - radiusYCont);
          setControlY6(e.clientY + radiusYCont);
          setControlY7(e.clientY + radiusYCont);
          setControlY8(e.clientY + radiusYCont);
          return radiusYCont;
        });
        setControlX2(e.clientX);
        setControlY4(e.clientY);
        setControlY5(e.clientY);
        setControlX7(e.clientX);
        return true;
      } else {
        return false;
      }
    });
    setZooming1((zooming1) => {
      if (zooming1) {
        setControlX3((controlX3) => {
          setEllipseX(Math.abs(e.clientX + (controlX3 - e.clientX) / 2));
          setRadiusXCont(Math.abs((controlX3 - e.clientX) / 2));
          setControlX2(Math.abs(e.clientX + (controlX3 - e.clientX) / 2));
          setControlX7(Math.abs(e.clientX + (controlX3 - e.clientX) / 2));
          setRectX(controlX3 - e.clientX < 0 ? controlX3 : e.clientX);
          return controlX3;
        });
        setControlY6((controlY6) => {
          setEllipseY(Math.abs(e.clientY + (controlY6 - e.clientY) / 2));
          setRadiusYCont(Math.abs((controlY6 - e.clientY) / 2));
          setControlY4(Math.abs(e.clientY + (controlY6 - e.clientY) / 2));
          setControlY5(Math.abs(e.clientY + (controlY6 - e.clientY) / 2));
          setRectY(controlY6 - e.clientY < 0 ? controlY6 : e.clientY);
          return controlY6;
        });
        setControlX1(e.clientX);
        setControlY1(e.clientY);
        setControlY2(e.clientY);
        setControlY3(e.clientY);
        setControlX4(e.clientX);
        setControlX6(e.clientX);
        return true;
      } else {
        return false;
      }
    });
    setZooming2((zooming2) => {
      if (zooming2) {
        setControlY2(e.clientY);
        setControlY1(e.clientY);
        setControlY3(e.clientY);
        setControlY6((controlY6) => {
          setControlY4(Math.abs(e.clientY + (controlY6 - e.clientY) / 2));
          setControlY5(Math.abs(e.clientY + (controlY6 - e.clientY) / 2));
          setRectY(controlY6 - e.clientY < 0 ? controlY6 : e.clientY);
          setRadiusYCont(Math.abs((controlY6 - e.clientY) / 2));
          setEllipseY(Math.abs(e.clientY + (controlY6 - e.clientY) / 2));
          return controlY6;
        });
        return true;
      } else {
        return false;
      }
    });
    setZooming3((zooming3) => {
      if (zooming3) {
        setControlX3(e.clientX);
        setControlY3(e.clientY);
        setControlY1(e.clientY);
        setControlY2(e.clientY);
        setControlX1((controlX1) => {
          setControlX2(Math.abs(e.clientX - (e.clientX - controlX1) / 2));
          setRadiusXCont(Math.abs((e.clientX - controlX1) / 2));
          setEllipseX(Math.abs(e.clientX - (e.clientX - controlX1) / 2));
          setControlX7(Math.abs(e.clientX - (e.clientX - controlX1) / 2));
          setRectX((e.clientX - controlX1) / 2 < 0 ? e.clientX : controlX1);
          return controlX1;
        });
        setControlY6((controlY6) => {
          setRadiusYCont(Math.abs((controlY6 - e.clientY) / 2));
          setEllipseY(Math.abs(e.clientY + (controlY6 - e.clientY) / 2));
          setControlY4(Math.abs(e.clientY + (controlY6 - e.clientY) / 2));
          setControlY5(Math.abs(e.clientY + (controlY6 - e.clientY) / 2));
          setRectY((controlY6 - e.clientY) / 2 < 0 ? controlY6 : e.clientY);
          return controlY6;
        });
        setControlX5(e.clientX);
        setControlX8(e.clientX);
        return true;
      } else {
        return false;
      }
    });
    setZooming4((zooming4) => {
      if (zooming4) {
        setControlX4(e.clientX);
        setControlX1(e.clientX);
        setControlX6(e.clientX);
        setControlX3((controlX3) => {
          setControlX2(Math.abs((controlX3 - e.clientX) / 2 + e.clientX));
          setControlX7(Math.abs((controlX3 - e.clientX) / 2 + e.clientX));
          setEllipseX(Math.abs((controlX3 - e.clientX) / 2 + e.clientX));
          setRadiusXCont(Math.abs((controlX3 - e.clientX) / 2));
          setRectX((controlX3 - e.clientX) / 2 < 0 ? controlX3 : e.clientX);
          return controlX3;
        });
        return true;
      } else {
        return false;
      }
    });
    setZooming5((zooming5) => {
      if (zooming5) {
        setControlX5(e.clientX);
        setControlY5(e.clientY);
        return true;
      } else {
        return false;
      }
    });
    setZooming6((zooming6) => {
      if (zooming6) {
        setControlX6(e.clientX);
        setControlY6(e.clientY);
        return true;
      } else {
        return false;
      }
    });
    setZooming7((zooming7) => {
      if (zooming7) {
        setControlX7(e.clientX);
        setControlY7(e.clientY);
        return true;
      } else {
        return false;
      }
    });
    setZooming8((zooming8) => {
      if (zooming8) {
        setControlX8(e.clientX);
        setControlY8(e.clientY);
        return true;
      } else {
        return false;
      }
    });
  };

  /**
   * The callback function to stop zooming once mouse is up. This one is necessary for control point 2, 4, 5, and 7 because mouse might move out of the control point during zooming
   */
  const clearMouseMove = () => {
    setZooming2(false);
    setZooming4(false);
    setZooming5(false);
    setZooming7(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", clearMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", clearMouseMove);
    };
  }, []);

  return (
    <Fragment>
      <ellipse
        cx={ellipseX}
        cy={ellipseY}
        rx={radiusXCont}
        ry={radiusYCont}
        style={{ fill: "#FFFFFF", stroke: "#000000" }}
      />
      <rect
        x={rectX}
        y={rectY}
        width={radiusXCont * 2}
        height={radiusYCont * 2}
        style={{ fill: "transparent", stroke: blue[400], cursor: "grab" }}
        onMouseDown={(e) => {
          setDragging(true);
        }}
        onMouseUp={(e) => {
          setDragging(false);
        }}
      />
      <circle
        cx={controlX1}
        cy={controlY1}
        r='4'
        style={{ fill: blue[400], cursor: "nwse-resize" }}
        onMouseDown={(e) => {
          setZooming1(true);
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
        }}
        onMouseUp={(e) => {
          setZooming8(false);
        }}
      />
    </Fragment>
  );
};

export default DrawEllipse;
