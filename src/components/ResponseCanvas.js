import React, { useRef, useEffect } from "react";

import { drawToPlot, initializeCanvasPlot } from "../utils";

export default function ResponseCanvas({
  responseData,
  responseStats,
  currentIdx,
  onMouseMove,
}) {
  const canvas = useRef();
  const plot = useRef();
  const arrs = useRef();
  arrs.current = responseData;
  const width = responseData[0].width;
  const height = responseData[0].height;

  useEffect(() => {
    if (!plot.current) {
      plot.current = initializeCanvasPlot(
        canvas.current,
        width,
        height,
        responseStats[currentIdx].noData
      );
    }
  }, [plot, width, height]);

  useEffect(() => {
    if (!plot.current) return;
    drawToPlot(
      plot.current,
      arrs.current[currentIdx],
      responseStats[currentIdx]
    );
  }, [plot, currentIdx]);

  useEffect(() => {
    if (!plot.current || !arrs.current) return;
    drawToPlot(
      plot.current,
      arrs.current[currentIdx],
      responseStats[currentIdx]
    );
  }, [currentIdx]);

  return (
    <canvas
      id="response"
      ref={canvas}
      className="modal-canvas"
      width={width}
      height={height}
      onMouseMove={onMouseMove}
    ></canvas>
  );
}
