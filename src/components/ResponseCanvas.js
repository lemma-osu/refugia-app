import React, { useRef, useEffect } from "react";
import { isEqual } from "lodash";

import { getAllImages, drawToPlot, initializeCanvasPlot } from "../utils";

export default function ResponseCanvas({
  responses,
  thresholds,
  centerCoord,
  width,
  height,
  onMouseMove,
  onLoaded,
}) {
  const canvas = useRef();
  const plot = useRef();
  const arrs = useRef();
  const initialIdx = useRef();

  initialIdx.current = responses.findIndex((r) =>
    isEqual(r.combination, thresholds)
  );

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
    getData(clickedCoord).then(() => {
      drawToPlot(plot.current, arrs.current[initialIdx.current]);
      responses.forEach((r) => {
        onLoaded(r.geotiff_path);
      });
    });
  }, [plot, centerCoord, responses, onLoaded, width, height, currentIdx]);

  useEffect(() => {
    if (!plot.current || !arrs.current) return;
    const idx = responses.findIndex((r) => isEqual(r.combination, thresholds));
    drawToPlot(plot.current, arrs.current[idx]);
  }, [thresholds, responses]);

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
