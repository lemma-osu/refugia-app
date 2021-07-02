import React, { useRef, useEffect } from "react";

import {
  get_canvas_data,
  draw_to_plot,
  initialize_canvas_plot,
} from "../utils";

const CovariateCanvas = ({ id, geotiff_path, clicked_coord }) => {
  const canvas = useRef();
  const plot = useRef();
  const arr = useRef([[]]);
  const width = 300;
  const height = 200;

  useEffect(() => {
    if (!plot.current) {
      plot.current = initialize_canvas_plot(canvas.current, width, height);
    }
  }, [plot]);

  useEffect(() => {
    if (!plot.current || !clicked_coord) return;
    async function get_data(coord) {
      arr.current = await get_canvas_data(
        coord.lng,
        coord.lat,
        geotiff_path,
        width,
        height
      );
    }
    get_data(clicked_coord).then(() => {
      draw_to_plot(plot.current, arr.current);
    });
  }, [plot, clicked_coord, geotiff_path]);

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
