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

  const onMouseMove = (event) => {
    setDragging((dragging) => {
      if (dragging) {
        setEllipseX(event.clientX);
        setEllipseY(event.clientY);
        setRadiusXCont((radiusXCont) => {
          setRectX(event.clientX - radiusXCont);
          setControlX1(event.clientX - radiusXCont);
          setControlX3(event.clientX + radiusXCont);
          setControlX4(event.clientX - radiusXCont);
          setControlX5(event.clientX + radiusXCont);
          setControlX6(event.clientX - radiusXCont);
          setControlX8(event.clientX + radiusXCont);
          return radiusXCont;
        });
        setRadiusYCont((radiusYCont) => {
          setRectY(event.clientY - radiusYCont);
          setControlY1(event.clientY - radiusYCont);
          setControlY2(event.clientY - radiusYCont);
          setControlY3(event.clientY - radiusYCont);
          setControlY6(event.clientY + radiusYCont);
          setControlY7(event.clientY + radiusYCont);
          setControlY8(event.clientY + radiusYCont);
          return radiusYCont;
        });
        setControlX2(event.clientX);
        setControlY4(event.clientY);
        setControlY5(event.clientY);
        setControlX7(event.clientX);
        return true;
      } else {
        return false;
      }
    });
    setZooming1((zooming1) => {
      if (zooming1) {
        setControlX3((controlX3) => {
          setEllipseX(
            Math.abs(event.clientX + (controlX3 - event.clientX) / 2)
          );
          setRadiusXCont(Math.abs((controlX3 - event.clientX) / 2));
          setControlX2(
            Math.abs(event.clientX + (controlX3 - event.clientX) / 2)
          );
          setControlX7(
            Math.abs(event.clientX + (controlX3 - event.clientX) / 2)
          );
          return controlX3;
        });
        setControlY6((controlY6) => {
          setEllipseY(
            Math.abs(event.clientY + (controlY6 - event.clientY) / 2)
          );
          setRadiusYCont(Math.abs((controlY6 - event.clientY) / 2));
          setControlY4(
            Math.abs(event.clientY + (controlY6 - event.clientY) / 2)
          );
          setControlY5(
            Math.abs(event.clientY + (controlY6 - event.clientY) / 2)
          );
          return controlY6;
        });
        setRectX(controlX3 - event.clientX < 0 ? controlX3 : event.clientX);
        setRectY(controlY6 - event.clientY < 0 ? controlY6 : event.clientY);
        setControlX1(event.clientX);
        setControlY1(event.clientY);
        setControlY2(event.clientY);
        setControlY3(event.clientY);
        setControlX4(event.clientX);
        setControlX6(event.clientX);
        return true;
      } else {
        return false;
      }
    });
    setZooming2((zooming2) => {
      if (zooming2) {
        setControlX2(event.clientX);
        setControlY2(event.clientY);
        return true;
      } else {
        return false;
      }
    });
    setZooming3((zooming3) => {
      if (zooming3) {
        setControlX3(event.clientX);
        setControlY3(event.clientY);
        return true;
      } else {
        return false;
      }
    });
    setZooming4((zooming4) => {
      if (zooming4) {
        setControlX4(event.clientX);
        setControlY4(event.clientY);
        return true;
      } else {
        return false;
      }
    });
    setZooming5((zooming5) => {
      if (zooming5) {
        setControlX5(event.clientX);
        setControlY5(event.clientY);
        return true;
      } else {
        return false;
      }
    });
    setZooming6((zooming6) => {
      if (zooming6) {
        setControlX6(event.clientX);
        setControlY6(event.clientY);
        return true;
      } else {
        return false;
      }
    });
    setZooming7((zooming7) => {
      if (zooming7) {
        setControlX7(event.clientX);
        setControlY7(event.clientY);
        return true;
      } else {
        return false;
      }
    });
    setZooming8((zooming8) => {
      if (zooming8) {
        setControlX8(event.clientX);
        setControlY8(event.clientY);
        return true;
      } else {
        return false;
      }
    });
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
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
        onMouseDown={(event) => {
          setDragging(true);
        }}
        onMouseUp={(event) => {
          setDragging(false);
        }}
      />
      <circle
        cx={controlX1}
        cy={controlY1}
        r='4'
        style={{ fill: blue[400], cursor: "nwse-resize" }}
        onMouseDown={(event) => {
          setZooming1(true);
        }}
        onMouseUp={(event) => {
          setZooming1(false);
        }}
      />
      <circle
        cx={controlX2}
        cy={controlY2}
        r='4'
        style={{ fill: blue[400], cursor: "ns-resize" }}
        onMouseDown={(event) => {
          setZooming2(true);
        }}
        onMouseUp={(event) => {
          setZooming2(false);
        }}
      />
      <circle
        cx={controlX3}
        cy={controlY3}
        r='4'
        style={{ fill: blue[400], cursor: "nesw-resize" }}
        onMouseDown={(event) => {
          setZooming3(true);
        }}
        onMouseUp={(event) => {
          setZooming3(false);
        }}
      />
      <circle
        cx={controlX4}
        cy={controlY4}
        r='4'
        style={{ fill: blue[400], cursor: "ew-resize" }}
        onMouseDown={(event) => {
          setZooming4(true);
        }}
        onMouseUp={(event) => {
          setZooming4(false);
        }}
      />
      <circle
        cx={controlX5}
        cy={controlY5}
        r='4'
        style={{ fill: blue[400], cursor: "ew-resize" }}
        onMouseDown={(event) => {
          setZooming5(true);
        }}
        onMouseUp={(event) => {
          setZooming5(false);
        }}
      />
      <circle
        cx={controlX6}
        cy={controlY6}
        r='4'
        style={{ fill: blue[400], cursor: "nesw-resize" }}
        onMouseDown={(event) => {
          setZooming6(true);
        }}
        onMouseUp={(event) => {
          setZooming6(false);
        }}
      />
      <circle
        cx={controlX7}
        cy={controlY7}
        r='4'
        style={{ fill: blue[400], cursor: "ns-resize" }}
        onMouseDown={(event) => {
          setZooming7(true);
        }}
        onMouseUp={(event) => {
          setZooming7(false);
        }}
      />
      <circle
        cx={controlX8}
        cy={controlY8}
        r='4'
        style={{ fill: blue[400], cursor: "nwse-resize" }}
        onMouseDown={(event) => {
          setZooming8(true);
        }}
        onMouseUp={(event) => {
          setZooming8(false);
        }}
      />
    </Fragment>
  );
};

export default DrawEllipse;
