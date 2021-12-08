import React, { forwardRef, useLayoutEffect, useState } from "react";

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

const Canvas = forwardRef((props, ref) => {
  const [width, height] = useWindowSize();

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{ backgroundColor: "#C8C8C8" }}
    />
  );
});

export default Canvas;
