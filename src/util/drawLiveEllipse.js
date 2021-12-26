import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

export default function DrawLiveEllipse({ updateDrawData }) {
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

  /**
   * Mouse down event handler
   * @param {object} e mouse down event
   */
  const onMouseDown = (e) => {
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
    setCx((cx) => {
      setCy((cy) => {
        setRx((rx) => {
          setRy((ry) => {
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
            setMouseDownX(null);
            setMouseDownY(null);
            return 0;
          });
          return 0;
        });
        return 0;
      });
      return 0;
    });
  };

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
