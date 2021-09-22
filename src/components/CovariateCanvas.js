import React, { useRef, useEffect } from "react";

import { getCanvasData, drawToPlot, initializeCanvasPlot } from "../utils";

export default function CovariateCanvas({
  id,
  geotiffPath,
  centerCoord,
  width,
  height,
  xy,
  variableValue,
  onLoaded,
}) {
  const canvas = useRef();
  const plot = useRef();
  const arr = useRef();

  // Create canvas element with the correct size
  useEffect(() => {
    if (!plot.current) {
      plot.current = initializeCanvasPlot(canvas.current, width, height);
    }
  }, [plot, width, height]);

  // Load the image once the canvas has initialized
  useEffect(() => {
    if (!plot.current || !centerCoord) return;
    async function getData(coord) {
      arr.current = await getCanvasData(
        coord.lng,
        coord.lat,
        geotiffPath,
        width,
        height
      );
    }
    getData(centerCoord).then(() => {
      drawToPlot(plot.current, arr.current);
      onLoaded(geotiffPath);
    });
  }, [plot, centerCoord, geotiffPath, onLoaded, width, height]);

  // Retrieve the value in the array at the xy offset and store in
  // variableValue ref provided by parent
  useEffect(() => {
    if (!plot.current || !arr.current) return;
    const offset = parseInt(xy.y, 10) * arr.current.width + parseInt(xy.x, 10);
    variableValue.current = arr.current[0][offset];
  }, [xy, variableValue]);

  return (
    <canvas
      id={id}
      ref={canvas}
      className="modal-canvas"
      width={width}
      height={height}
    ></canvas>
  );
}
