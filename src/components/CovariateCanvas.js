import React, { useRef, useEffect } from "react";

import {
  get_canvas_data,
  draw_to_plot,
  initialize_canvas_plot,
} from "../utils";

const CovariateCanvas = ({
  id,
  geotiff_path,
  clicked_coord,
  xy,
  variable_value,
  loaded_func,
}) => {
  const canvas = useRef();
  const plot = useRef();
  const arr = useRef();
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
      loaded_func(geotiff_path);
    });
  }, [plot, clicked_coord, geotiff_path, loaded_func]);

  useEffect(() => {
    if (!plot.current || !arr.current) return;
    const offset = parseInt(xy.y, 10) * arr.current.width + parseInt(xy.x, 10);
    variable_value.current = arr.current[0][offset];
  }, [xy, variable_value]);

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
