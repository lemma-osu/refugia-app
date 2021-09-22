import React, { useRef, useEffect } from "react";

import { getAllImages, drawToPlot, initializeCanvasPlot } from "../utils";

export default function ResponseCanvas({
  responses,
  centerCoord,
  width,
  height,
  currentIdx,
  onMouseMove,
  onLoaded,
}) {
  const canvas = useRef();
  const plot = useRef();
  const arrs = useRef();

  useEffect(() => {
    if (!plot.current) {
      plot.current = initializeCanvasPlot(canvas.current, width, height);
    }
  }, [plot, width, height]);

  useEffect(() => {
    if (!plot.current || !centerCoord) return;
    async function getData(coord) {
      const paths = responses.map((r) => r.geotiff_path);
      arrs.current = await getAllImages(
        coord.lng,
        coord.lat,
        paths,
        width,
        height
      );
    }
    getData(centerCoord).then(() => {
      drawToPlot(plot.current, arrs.current[currentIdx]);
      responses.forEach((r) => {
        onLoaded(r.geotiff_path);
      });
    });
  }, [plot, centerCoord, responses, onLoaded, width, height, currentIdx]);

  useEffect(() => {
    if (!plot.current || !arrs.current) return;
    drawToPlot(plot.current, arrs.current[currentIdx]);
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
