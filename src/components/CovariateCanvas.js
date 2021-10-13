import React, { useRef, useEffect } from "react";

import { drawToPlot, initializeCanvasPlot, unscaleArray } from "../utils";

export default function CovariateCanvas({
  id,
  imageData,
  imageStats,
  xy,
  variableValue,
}) {
  const canvas = useRef();
  const pointCanvas = useRef();
  const plot = useRef();
  const arr = useRef();
  const width = imageData.width;
  const height = imageData.height;

  // Create canvas element with the correct size
  useEffect(() => {
    if (!plot.current) {
      plot.current = initializeCanvasPlot(
        canvas.current,
        width,
        height,
        imageStats.noData,
        "covariate"
      );
    }
  }, [plot, width, height]);

  useEffect(() => {
    if (arr.current) return;
    arr.current = unscaleArray(imageData, imageStats.scale, imageStats.offset);
  }, [arr, imageData, imageStats]);

  // Load the image once the canvas has initialized
  useEffect(() => {
    if (!arr.current) return;
    drawToPlot(plot.current, arr.current, imageStats);
  }, [plot, arr]);

  // Retrieve the value in the array at the xy offset and store in
  // variableValue ref provided by parent
  useEffect(() => {
    if (!plot.current || !arr.current) return;
    const offset = parseInt(xy.y, 10) * arr.current.width + parseInt(xy.x, 10);
    variableValue.current = arr.current[0][offset];

    // Draw a point at the xy location
    function drawPoint(xy) {
      const pointSize = parseInt(0.02 * width);
      const ctx = pointCanvas.current.getContext("2d");
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(xy.x, xy.y, pointSize, 0, Math.PI * 2, true);
      ctx.fill();
    }
    drawPoint(xy);
  }, [xy, variableValue]);

  return (
    <div className="stage">
      <canvas
        id={id}
        ref={canvas}
        className="modal-canvas background"
        width={width}
        height={height}
      ></canvas>
      <canvas
        ref={pointCanvas}
        className="modal-canvas foreground"
        width={width}
        height={height}
      ></canvas>
    </div>
  );
}
