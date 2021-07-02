import React, { useRef, useEffect } from "react";
import { isEqual } from "lodash";

import {
  get_all_images,
  draw_to_plot,
  initialize_canvas_plot,
} from "../utils";

const ResponseCanvas = ({ responses, clicked_coord, thresholds }) => {
  const canvas = useRef();
  const plot = useRef();
  const arrs = useRef();
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
      const paths = responses.map((r) => r.geotiff_path);
      arrs.current = await get_all_images(
        coord.lng,
        coord.lat,
        paths,
        width,
        height
      );
    }
    get_data(clicked_coord).then(() => {
      const idx = responses.findIndex((r) =>
        isEqual(r.combination, thresholds)
      );
      draw_to_plot(plot.current, arrs.current[idx]);
    });
  }, [plot, clicked_coord, responses]);

  useEffect(() => {
    if (!plot.current || !arrs.current) return;
    const idx = responses.findIndex((r) => isEqual(r.combination, thresholds));
    draw_to_plot(plot.current, arrs.current[idx]);
  }, [thresholds, responses]);

  return (
    <canvas
      id="response"
      ref={canvas}
      className="modal-canvas"
      width={width}
      height={height}
    ></canvas>
  );
};

export default ResponseCanvas;
