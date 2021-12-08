import React, { useEffect, useState, Fragment } from "react";
import { blue } from "@mui/material/colors";

const DrawEllipse = ({ x, y, radiusX, radiusY }) => {
  const [clientX, setClientX] = useState();
  const [clientY, setClientY] = useState();
  const [dragging, setDragging] = useState(false);

  const onMouseMove = (event) => {
    setDragging((dragging) => {
      if (dragging) {
        setClientX(event.clientX);
        setClientY(event.clientY);
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
        cx={clientX ? clientX : x}
        cy={clientY ? clientY : y}
        rx={radiusX}
        ry={radiusY}
        style={{ fill: "#FFFFFF", stroke: "#000000" }}
      />
      <rect
        x={(clientX ? clientX : x) - radiusX}
        y={(clientY ? clientY : y) - radiusY}
        width={radiusX * 2}
        height={radiusY * 2}
        style={{ fill: "transparent", stroke: blue[400], cursor: "grab" }}
        onMouseDown={(event) => {
          setDragging(true);
        }}
        onMouseUp={(event) => {
          setDragging(false);
        }}
      />
      <circle
        cx={(clientX ? clientX : x) - radiusX}
        cy={(clientY ? clientY : y) - radiusY}
        r='4'
        style={{ fill: blue[400], cursor: "nwse-resize" }}
      />
      <circle
        cx={clientX ? clientX : x}
        cy={(clientY ? clientY : y) - radiusY}
        r='4'
        style={{ fill: blue[400], cursor: "ns-resize" }}
      />
      <circle
        cx={(clientX ? clientX : x) + radiusX}
        cy={(clientY ? clientY : y) - radiusY}
        r='4'
        style={{ fill: blue[400], cursor: "nesw-resize" }}
      />
      <circle
        cx={(clientX ? clientX : x) - radiusX}
        cy={clientY ? clientY : y}
        r='4'
        style={{ fill: blue[400], cursor: "ew-resize" }}
      />
      <circle
        cx={(clientX ? clientX : x) + radiusX}
        cy={clientY ? clientY : y}
        r='4'
        style={{ fill: blue[400], cursor: "ew-resize" }}
      />
      <circle
        cx={(clientX ? clientX : x) - radiusX}
        cy={(clientY ? clientY : y) + radiusY}
        r='4'
        style={{ fill: blue[400], cursor: "nesw-resize" }}
      />
      <circle
        cx={clientX ? clientX : x}
        cy={(clientY ? clientY : y) + radiusY}
        r='4'
        style={{ fill: blue[400], cursor: "ns-resize" }}
      />
      <circle
        cx={(clientX ? clientX : x) + radiusX}
        cy={(clientY ? clientY : y) + radiusY}
        r='4'
        style={{ fill: blue[400], cursor: "nwse-resize" }}
      />
    </Fragment>
  );
};

export default DrawEllipse;
