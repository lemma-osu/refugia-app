import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import * as bootstrap from "bootstrap";
import * as d3 from "d3";
import { plot as Plot } from "plotty";

import { access_token } from "../tokens";
import { create_source_objects } from "../generate-map-spec";
import { project_point } from "../projection";
import { read_raster_definitions, read_tiffs } from "../utils";

import config from "../config.json";

const App = () => {
  useEffect(() => {
    mapboxgl.accessToken = access_token;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v10",
      bounds: [
        [-123.0, 43.5],
        [-122.85, 43.65],
      ],
      maxZoom: 12.9,
    });

    const modal_div = document.querySelector("#example-modal");
    const modal = new bootstrap.Modal(modal_div);
    const zoom_limit = 11.5;
    const canvas_width = 300;
    const canvas_height = 200;
    const zip = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]));
    let canvasses, charts, arrs;
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
      var before_layer =
        map.getLayer("forest-mask-layer") === undefined
          ? "land-structure-polygon"
          : "forest-mask-layer";
      map.addLayer(layer_definition.layer, before_layer);
      return layer_definition.layer.id;
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
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          val = (data[y * width + x] - min) / range;
          out[y * width + x] = val;
        }
      }
      arr[0] = out;
      return arr;
    }

    function create_canvas_elements() {
      const response = config.geotiffs.filter((x) => x.type === "response")[0];
      const covariates = config.geotiffs.filter((x) => x.type === "covariate");

      const response_panel = document.querySelector("#response-panel");
      response_panel.innerHTML = `
    <canvas id="canvas-${response.name}" class="modal-canvas" width="${canvas_width}" height="${canvas_height}"></canvas>
  `;

      const right_panel = document.querySelector("#covariate-panel");
      let inner = "";
      covariates.forEach((v) => {
        const covariate_html = `
      <div class="covariate-group">
        <div><small>${v.description}</small></div>
        <canvas id="canvas-${v.name}" class="modal-canvas" width=${canvas_width} height=${canvas_height}></canvas>
        <div id="chart-${v.name}" class="modal-chart">
          <svg></svg>
        </div>
      </div>
    `;
        inner += covariate_html;
      });
      right_panel.innerHTML = inner;

      canvasses = Array.from(document.querySelectorAll("canvas.modal-canvas"));
      charts = Array.from(document.querySelectorAll("div.modal-chart"));
    }

    function change_dots(charts, arrs, offset) {
      zip([charts, arrs]).forEach((t) => {
        const [chart, arr] = t;
        const pix =
          (arr[0][offset] - d3.min(arr[0])) / (d3.max(arr[0]) - d3.min(arr[0]));
        change_dot(chart, pix);
      });
    }

    function change_dot(element, value) {
      const svg = d3.select(element).select("svg");
      const path = svg.select("path.model-path");
      const length = path.node().getTotalLength();
      const r = d3.interpolate(0, length);
      var point = path.node().getPointAtLength(r(value));
      svg
        .selectAll("circle")
        .data([point])
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });
    }

    function update_canvas(canvas, arr) {
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

    function update_canvasses(canvasses, arrs) {
      zip([canvasses, arrs]).forEach((t) => {
        const [canvas, arr] = t;
        update_canvas(canvas, arr);
      });
    }

    function update_charts(charts, data) {
      zip([charts, data]).forEach((t) => {
        const [chart, data] = t;
        update_chart(chart, data);
      });
    }

    function update_chart(element, data) {
      const margin = { top: 5, right: 5, bottom: 20, left: 20 };
      const width = 223;
      const height = 148;

      const x = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.x), d3.max(data, (d) => d.x)])
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.y), d3.max(data, (d) => d.y)])
        .range([height - margin.bottom, margin.top]);

      const xAxis = (g) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        );

      const yAxis = (g) =>
        g.attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

      const line = d3
        .line()
        .x((d) => x(d.x))
        .y((d) => y(d.y));

      const svg = d3.select(element).select("svg");
      svg.selectAll("*").remove();
      svg.attr("viewBox", [0, 0, width, height]);
      svg.append("g").call(xAxis);
      svg.append("g").call(yAxis);
      const path = svg
        .append("path")
        .datum(data)
        .attr("class", "model-path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

      const length = path.node().getTotalLength();
      const r = d3.interpolate(0, length);

      const slider_value = 50; // parseFloat(slider.value, 10);
      const point = path.node().getPointAtLength(r(0.01 * slider_value));
      svg
        .append("circle")
        .attr("cx", point.x)
        .attr("cy", point.y)
        .attr("r", "4px")
        .attr("fill", "red");
    }

    async function hack_partial_dependence(arrs) {
      const response = arrs[0];
      const covariates = arrs.slice(1);
      return await covariates.map((arr) => {
        // Create stacked array of response and covariate
        let min_ = d3.min(arr[0]);
        let max_ = d3.max(arr[0]);
        let range_ = max_ - min_;

        // Arrays
        let x_vals = [[], [], [], [], [], [], [], [], [], []];
        let y_vals = [[], [], [], [], [], [], [], [], [], []];

        // Bin data
        for (let i = 0; i < arr[0].length; i++) {
          let bin = Math.round(((arr[0][i] - min_) / range_) * 10);
          if (bin === 10) {
            bin = 9;
          }
          x_vals[bin].push(arr[0][i]);
          y_vals[bin].push(response[0][i]);
        }

        // Get means of bins
        let path_data = [];
        for (let i = 0; i < 10; i++) {
          path_data.push({
            x: d3.mean(x_vals[i]),
            y: d3.mean(y_vals[i]),
          });
        }
        return path_data;
      });
    }

    async function display_modal(event) {
      console.log("Running modal");
      // Charts
      const path1_data = [
        { x: 0, y: 2.5 },
        { x: 1, y: 2 },
        { x: 2, y: 1 },
        { x: 3, y: 4 },
        { x: 4, y: 3 },
      ];

      const xy = project_point(event.lngLat.lng, event.lngLat.lat);
      const img_defs = await read_raster_definitions(
        config.geotiffs,
        xy,
        canvas_width,
        canvas_height
      );
      arrs = await read_tiffs(img_defs);
      const path_data = await hack_partial_dependence(arrs);
      update_canvasses(canvasses, arrs);
      update_charts(charts, path_data);

      // Create event listener for response canvas
      const response_canvas = canvasses[0];
      const covariate_arrs = arrs.slice(1);
      response_canvas.addEventListener("mousemove", function (e) {
        const rect = response_canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const canvas_x = parseInt(response_canvas.width * (x / rect.width), 10);
        const canvas_y = parseInt(
          response_canvas.height * (y / rect.height),
          10
        );
        const offset = canvas_y * response_canvas.height + canvas_x;
        change_dots(charts, covariate_arrs, offset);
      });

      const coord_div = modal_div.querySelector("#coord");
      coord_div.textContent = `Coordinate: (${xy[0].toFixed(
        3
      )}, ${xy[1].toFixed(3)})`;
      modal.show();
    }

    modal_div.addEventListener("hidden.bs.modal", function (event) {
      handle_cursor();
    });

    map.on("dblclick", function (event) {
      if (map.getZoom() >= zoom_limit) {
        event.preventDefault();
        map.getCanvas().style.cursor = "wait";
        display_modal(event);
      }
    });

    function handle_cursor() {
      map.getCanvas().style.cursor =
        map.getZoom() >= zoom_limit ? "crosshair" : "grab";
    }

    map.on("zoom", function () {
      handle_cursor();
    });

    async function initialize() {
      const map_layers = await create_source_objects(config);
      current_layer = change_map(map, map_layers["ogsi-80"], current_layer);
      handle_cursor();
      create_canvas_elements();
    }

    map.on("load", initialize);
  });

  return (
    <>
      <div id="map" className="map"></div>
      <div
        className="card text-white bg-dark m-3"
        style={{ maxWidth: "20rem", height: "calc(100vh - 32px)" }}
      >
        <div className="card-body">
          <h5 className="card-title">Fire Refugia Demonstration</h5>
          <p className="card-text">
            This application is pretty much the coolest application in the
            entire world even though it basically does nothing at present. This
            card gives information about the map to the right and provides the
            instructions to the user on how to create the modal for a particular
            study area.
          </p>
          <p className="card-text">
            To enable the modal demonstration, zoom in to an extent where the
            cursor changes to a crosshair and double click the button. This will
            load the modal window and show the demonstration.
          </p>
        </div>
      </div>
      <div
        className="modal fade"
        id="example-modal"
        tabIndex="-1"
        aria-labelledby="example-modal-label"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="example-modal-label">
                Refugia what-if?
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body container-fluid">
              <div className="row">
                <div id="response-panel" className="col-md-6"></div>
                <div id="ui" className="col-md-6">
                  <p>
                    The map on the left is refugial probability. Each map below
                    is a covariate that helps determine probability of refugia.
                  </p>
                  <p id="coord"></p>
                  <form>
                    <div className="form-floating mb-3">
                      <select
                        id="model-response"
                        className="form-select"
                        aria-label="Model response"
                        defaultValue="refugia"
                      >
                        <option value="refugia">Fire Refugia</option>
                        <option value="high-severity">High Severity</option>
                      </select>
                      <label htmlFor="model-response">
                        Model Response Variable
                      </label>
                    </div>
                    <label htmlFor="threshold" className="form-label">
                      Threshold
                    </label>
                    <input
                      className="form-range"
                      type="range"
                      id="threshold"
                      name="threshold"
                      min="0"
                      max="100"
                      defaultValue="50"
                      step="1"
                    />
                  </form>
                </div>
              </div>
              <div className="row">
                <div id="covariate-panel" className="col-md-12"></div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
