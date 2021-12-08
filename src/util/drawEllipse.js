import { blue } from "@mui/material/colors";

const drawEllipse = (x, y, radiusX, radiusY) => {
  return [
    <ellipse
      cx={x}
      cy={y}
      rx={radiusX}
      ry={radiusY}
      style={{ fill: "#FFFFFF", stroke: "#000000", cursor: "grab" }}
    />,
    <rect
      x={x - radiusX}
      y={y - radiusY}
      width={radiusX * 2}
      height={radiusY * 2}
      style={{ fill: "transparent", stroke: blue[400] }}
    />,
    <circle
      cx={x - radiusX}
      cy={y - radiusY}
      r='4'
      style={{ fill: blue[400], cursor: "nwse-resize" }}
    />,
    <circle
      cx={x}
      cy={y - radiusY}
      r='4'
      style={{ fill: blue[400], cursor: "ns-resize" }}
    />,
    <circle
      cx={x + radiusX}
      cy={y - radiusY}
      r='4'
      style={{ fill: blue[400], cursor: "nesw-resize" }}
    />,
    <circle
      cx={x - radiusX}
      cy={y}
      r='4'
      style={{ fill: blue[400], cursor: "ew-resize" }}
    />,
    <circle
      cx={x + radiusX}
      cy={y}
      r='4'
      style={{ fill: blue[400], cursor: "ew-resize" }}
    />,
    <circle
      cx={x - radiusX}
      cy={y + radiusY}
      r='4'
      style={{ fill: blue[400], cursor: "nesw-resize" }}
    />,
    <circle
      cx={x}
      cy={y + radiusY}
      r='4'
      style={{ fill: blue[400], cursor: "ns-resize" }}
    />,
    <circle
      cx={x + radiusX}
      cy={y + radiusY}
      r='4'
      style={{ fill: blue[400], cursor: "nwse-resize" }}
    />,
  ];
};

export default drawEllipse;
