import { fromArrayBuffer } from "geotiff";
import { quantile } from "d3";
import { plot as Plot } from "plotty";

import { project_point } from "./projection";

export const zip = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]));

async function load_tiff(path) {
  const response = await fetch(path);
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await fromArrayBuffer(arrayBuffer);
  return await tiff.getImage();
}

function get_rc(img, xy) {
  const [ul_x, ul_y] = img.getOrigin();
  const [x_res, y_res] = img.getResolution();
  const row = Math.floor(Math.abs((xy[1] - ul_y) / y_res));
  const col = Math.floor(Math.abs((xy[0] - ul_x) / x_res));
  return [row, col];
}

function get_corners(center_rc, width, height) {
  const [r, c] = center_rc;
  const half_width = Math.floor(width / 2);
  const half_height = Math.floor(height / 2);
  return [c - half_width, r - half_height, c + half_width, r + half_height];
}

async function read_raster_definition(path, xy, canvas_width, canvas_height) {
  const img = await load_tiff(path, xy);
  const pt = get_rc(img, xy);
  const window = get_corners(pt, canvas_width, canvas_height);
  return {
    img: img,
    window: window,
  };
}

export async function read_raster_definitions(
  geotiffs,
  xy,
  canvas_width,
  canvas_height
) {
  const promises = geotiffs.map((geotiff) =>
    read_raster_definition(geotiff.path, xy, canvas_width, canvas_height)
  );
  return await Promise.all(promises);
}

async function read_tiff(img, window) {
  return await img.readRasters({ window: window });
}

export async function read_tiffs(img_defs) {
  const promises = img_defs.map((def) => read_tiff(def.img, def.window));
  return await Promise.all(promises);
}

export async function get_canvas_data(lng, lat, geotiff_path, width, height) {
  const xy = project_point(lng, lat);
  const def = await read_raster_definition(geotiff_path, xy, width, height);
  return await read_tiff(def.img, def.window);
}

export function initialize_canvas_plot(canvas, width, height) {
  return new Plot({
    canvas: canvas,
    width: width,
    height: height,
    colorScale: "viridis",
  });
}

export function draw_to_plot(plot, arr) {
  const min = quantile(arr[0], 0.02);
  const max = quantile(arr[0], 0.98);
  plot.setData(arr[0], arr.width, arr.height);
  plot.setDomain([min, max]);
  plot.render();
}
