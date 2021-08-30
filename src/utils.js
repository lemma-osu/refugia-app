import { fromUrl } from "geotiff";
import { quantile } from "d3";
import { plot as Plot } from "plotty";

import { projectPoint } from "./projection";

export const zip = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]));

async function loadTiff(path) {
  const tiff = await fromUrl(path);
  return await tiff.getImage();
}

function getRowCol(img, xy) {
  const [ulX, ulY] = img.getOrigin();
  const [xRes, yRes] = img.getResolution();
  const row = Math.floor(Math.abs((xy[1] - ulY) / yRes));
  const col = Math.floor(Math.abs((xy[0] - ulX) / xRes));
  return [row, col];
}

function getCorners(centerRowCol, width, height) {
  const [r, c] = centerRowCol;
  const halfWidth = Math.floor(width / 2);
  const halfHeight = Math.floor(height / 2);
  return [c - halfWidth, r - halfHeight, c + halfWidth, r + halfHeight];
}

async function readRasterDefinition(path, xy, canvasWidth, canvasHeight) {
  const img = await loadTiff(path, xy);
  const pt = getRowCol(img, xy);
  const window = getCorners(pt, canvasWidth, canvasHeight);
  return {
    img: img,
    window: window,
    nodata: parseInt(img.fileDirectory.GDAL_NODATA, 10),
  };
}

async function readTiff(img, window) {
  return await img.readRasters({ window: window });
}

export async function getCanvasData(lng, lat, geotiffPath, width, height) {
  const xy = projectPoint(lng, lat);
  const def = await readRasterDefinition(geotiffPath, xy, width, height);
  return await readTiff(def.img, def.window);
}

export async function getAllImages(lng, lat, geotiffPaths, width, height) {
  const promises = geotiffPaths.map((path) =>
    getCanvasData(lng, lat, path, width, height)
  );
  return await Promise.all(promises);
}

export function initializeCanvasPlot(canvas, width, height) {
  return new Plot({
    canvas: canvas,
    width: width,
    height: height,
    colorScale: "viridis",
    useWebGL: false,
  });
}

export function drawToPlot(plot, arr) {
  const min = quantile(arr[0], 0.02);
  const max = quantile(arr[0], 0.98);
  plot.setData(arr[0], arr.width, arr.height);
  plot.setDomain([min, max]);
  plot.render();
}
