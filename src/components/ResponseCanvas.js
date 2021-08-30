import React, { useRef, useEffect } from "react";
import { isEqual } from "lodash";

import { getAllImages, drawToPlot, initializeCanvasPlot } from "../utils";

const ResponseCanvas = ({
  responses,
  clickedCoord,
  thresholds,
  onMouseMove,
  loadedFunc,
}) => {
  const canvas = useRef();
  const plot = useRef();
  const arrs = useRef();
  const initialIdx = useRef();
  const width = 300;
  const height = 200;

  initialIdx.current = responses.findIndex((r) =>
    isEqual(r.combination, thresholds)
  );

  useEffect(() => {
    if (!plot.current) {
      plot.current = initializeCanvasPlot(canvas.current, width, height);
    }
  }, [plot]);

  useEffect(() => {
    if (!plot.current || !clickedCoord) return;
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
        loadedFunc(r.geotiff_path);
      });
    });
  }, [plot, clickedCoord, responses, loadedFunc]);

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
};

export default ResponseCanvas;
