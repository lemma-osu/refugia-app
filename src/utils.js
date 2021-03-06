import { useRef, useEffect } from "react";
import { fromUrl } from "geotiff";
import { csv, autoType } from "d3";
import { plot as Plot, addColorScale } from "plotty";

import { projectPoint } from "./projection";

// Color scales for plotty
addColorScale(
  "refugia",
  [
    "rgb(140, 81, 10)",
    "rgb(140, 81, 10)",
    "rgb(216, 179, 101)",
    "rgb(246, 232, 195)",
    "rgb(199, 234, 229)",
    "rgb(90, 180, 172)",
    "rgb(1, 102, 94)",
    "rgb(1, 102, 94)",
  ],
  [0.0, 0.239, 0.301, 0.358, 0.417, 0.501, 0.679, 1.0]
);

addColorScale(
  "covariate",
  [
    "rgb(140, 81, 10)",
    "rgb(216, 179, 101)",
    "rgb(246, 232, 195)",
    "rgb(199, 234, 229)",
    "rgb(90, 180, 172)",
    "rgb(1, 102, 94)",
  ],
  [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]
);

export const COVARIATE_RAMP = [
  {
    offset: 0.0,
    color: "rgb(140, 81, 10)",
  },
  {
    offset: 20.0,
    color: "rgb(216, 179, 101)",
  },
  {
    offset: 40.0,
    color: "rgb(246, 232, 195)",
  },
  {
    offset: 60.0,
    color: "rgb(199, 234, 229)",
  },
  {
    offset: 80.0,
    color: "rgb(90, 180, 172)",
  },
  {
    offset: 100.0,
    color: "rgb(1, 102, 94)",
  },
];

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

export function initializeCanvasPlot(
  canvas,
  width,
  height,
  noData,
  colorScale
) {
  return new Plot({
    canvas: canvas,
    width: width,
    height: height,
    noDataValue: noData,
    colorScale: colorScale,
    useWebGL: false,
  });
}

export function drawToPlot(plot, arr, imageStats) {
  // const min = quantile(arr[0], 0.02);
  // const max = quantile(arr[0], 0.98);
  plot.setData(arr[0], arr.width, arr.height);
  plot.setDomain([imageStats.min, imageStats.max]);
  plot.render();
}

export async function getPercentiles(statisticsPath, percentileArr) {
  const data = await csv(statisticsPath, autoType);
  const dict = {};
  data.forEach((d) => (dict[d.PERCENTILE] = d.VALUE));
  return percentileArr.map((percentile) => {
    return dict[percentile];
  });
}

export function unscaleArray(img, scale, offset) {
  const scaled = { ...img };
  scaled[0] = Float32Array.from(img[0], (x) => (x - offset) / scale);
  return scaled;
}

export function useWhyDidYouUpdate(name, props) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef();
  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj = {};
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });
      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj);
      }
    }
    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}
