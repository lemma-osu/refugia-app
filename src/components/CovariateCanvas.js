import React, { useRef, useEffect } from "react";
import { min, max } from "d3";

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
  const arr_min = useRef(0);
  const arr_max = useRef(0);
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
      arr_min.current = min(arr.current[0]);
      arr_max.current = max(arr.current[0]);
      draw_to_plot(plot.current, arr.current);
      loaded_func(geotiff_path);
    });
  }, [plot, clicked_coord, geotiff_path, loaded_func]);

  useEffect(() => {
    if (!plot.current || !arr.current) return;
    const offset = parseInt(xy.y, 10) * arr.current.width + parseInt(xy.x, 10);
    const value = arr.current[0][offset];
    variable_value.current =
      (value - arr_min.current) / (arr_max.current - arr_min.current);
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
