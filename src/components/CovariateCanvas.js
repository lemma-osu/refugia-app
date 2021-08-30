import React, { useRef, useEffect } from "react";

import { getCanvasData, drawToPlot, initializeCanvasPlot } from "../utils";

const CovariateCanvas = ({
  id,
  geotiffPath,
  clickedCoord,
  xy,
  variableValue,
  loadedFunc,
}) => {
  const canvas = useRef();
  const plot = useRef();
  const arr = useRef();
  const width = 300;
  const height = 200;

  useEffect(() => {
    if (!plot.current) {
      plot.current = initializeCanvasPlot(canvas.current, width, height);
    }
  }, [plot]);

  useEffect(() => {
    if (!plot.current || !clickedCoord) return;
    async function getData(coord) {
      arr.current = await getCanvasData(
        coord.lng,
        coord.lat,
        geotiffPath,
        width,
        height
      );
    }
    getData(clickedCoord).then(() => {
      drawToPlot(plot.current, arr.current);
      loadedFunc(geotiffPath);
    });
  }, [plot, clickedCoord, geotiffPath, loadedFunc]);

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
};

export default CovariateCanvas;
