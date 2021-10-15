import React, { useRef, useEffect } from "react";

import { drawToPlot, initializeCanvasPlot, unscaleArray } from "../utils";

export default function ResponseCanvas({
  responseData,
  responseStats,
  currentIdx,
  onMouseMove,
}) {
  const canvas = useRef();
  const plot = useRef();
  const arrs = useRef();
  const width = responseData[0].width;
  const height = responseData[0].height;

  useEffect(() => {
    if (!plot.current) {
      plot.current = initializeCanvasPlot(
        canvas.current,
        width,
        height,
        responseStats[currentIdx].noData,
        "refugia"
      );
    }
  }, [plot, width, height, responseStats, currentIdx]);

  useEffect(() => {
    arrs.current = responseData.map((data, idx) => {
      const scale = responseStats[idx].scale;
      const offset = responseStats[idx].offset;
      return unscaleArray(data, scale, offset);
    });
  }, [arrs, responseData, responseStats]);

  useEffect(() => {
    if (!plot.current || !arrs.current) return;
    drawToPlot(
      plot.current,
      arrs.current[currentIdx],
      responseStats[currentIdx]
    );
  }, [currentIdx, responseStats]);

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
