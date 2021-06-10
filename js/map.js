import * as bootstrap from "bootstrap";
import * as d3 from "d3";
import { fromArrayBuffer } from "geotiff";
import mapboxgl from 'mapbox-gl';
import { plot as Plot } from "plotty";

import { create_source_objects } from "./generate-map-spec.js"
import { project_point } from "./projection.js";
import { access_token } from "./tokens.js";

mapboxgl.accessToken = access_token;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  // bounds: [[-125.0, 37.0], [-120.0, 49.5]]
  bounds: [[-123.0, 43.5], [-122.85, 43.65]],
  maxZoom: 12.9
});

const modal_div = document.querySelector("#example-modal");
const modal = new bootstrap.Modal(modal_div);
const zoom_limit = 11.5;
const canvas = document.querySelector("#canvas");
let current_layer;

function change_map(map, layer_definition, current_layer) {
  // Pop the current layer off
  if (current_layer !== undefined) {
    map.removeLayer(current_layer);
  }

  // Add the new source if necessary
  var key = layer_definition.layer.source;
  if (map.getSource(key) === undefined || !map.isSourceLoaded(key)) {
    map.addSource(key, layer_definition.source);
  }

  // Add the new layer
  var before_layer = map.getLayer("forest-mask-layer") === undefined
    ? "land-structure-polygon"
    : "forest-mask-layer";
  map.addLayer(layer_definition.layer, before_layer);
  return layer_definition.layer.id;
}

async function load_tiff(path) {
  const response = await fetch(path);
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await fromArrayBuffer(arrayBuffer);    
  return await tiff.getImage();
}

async function read_tiff(img, window) {
  return await img.readRasters({ window: window });
}

function normalize(arr) {
  const width = arr.width;
  const height = arr.height;
  const data = arr[0];
  var out = new Float32Array(height * width);
  const min = d3.quantile(data, 0);
  const max = d3.quantile(data, 1);
  const range = max - min;
  let val;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      val = (data[(y * width) + x] - min) / range;
      out[(y * width) + x] = val;
    }
  }
  arr[0] = out;
  return arr;
}

function update_image(canvas, arr) {
  const min = d3.quantile(arr[0], 0.02);
  const max = d3.quantile(arr[0], 0.98);
  const plot = new Plot({
    canvas,
    data: arr[0],
    width: arr.width,
    height: arr.height,
    domain: [min, max],
    colorScale: "viridis",
  });
  plot.render();
}

function get_rc(img, xy) {
  const [ul_x, ul_y] = img.getOrigin();
  const [x_res, y_res] = img.getResolution();
  const row = Math.floor(Math.abs((xy[1] - ul_y) / y_res));
  const col = Math.floor(Math.abs((xy[0] - ul_x) / x_res));
  return [row, col];
}

function get_corners(center_rc, dim=300) {
  const [r, c] = center_rc;
  const half_dim = Math.floor(dim / 2);
  return [c - half_dim, r - half_dim, c + half_dim, r + half_dim];
}

async function display_modal(event) {
  const xy = project_point(event.lngLat.lng, event.lngLat.lat);
  // const img = await load_tiff("./geotiffs/probability_masked.tif");
  const img = await load_tiff("/geotiffs/cog_test/test_cog_int.tif");
  const pt = get_rc(img, xy);
  const window = get_corners(pt, 300);
  const data = await read_tiff(img, window);
  update_image(canvas, data);
  const coord_div = modal_div.querySelector("#coord");
  coord_div.textContent = `Coordinate: (${xy[0].toFixed(3)}, ${xy[1].toFixed(3)})`;
  modal.show();
}

map.on("dblclick", function(event) {
  if (map.getZoom() >= zoom_limit) {
    event.preventDefault();
    display_modal(event);
  }
})

function handle_cursor() {
  map.getCanvas().style.cursor = map.getZoom() >= zoom_limit
    ? "crosshair"
    : "grab";
}

map.on("zoom", function() {
  handle_cursor();
});

async function initialize() {
  const map_layers = await create_source_objects();
  current_layer = change_map(map, map_layers["ogsi-80"], current_layer);
  handle_cursor();
}

map.on("load", initialize);
