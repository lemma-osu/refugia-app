import React, { useRef, useState, useEffect } from "react";
import { Modal } from "bootstrap";
import * as d3 from "d3";
import { plot as Plot } from "plotty";

import { project_point } from "../projection";
import { read_raster_definitions, read_tiffs, zip } from "../utils";

import SliderContainer from "./SliderContainer";

const DemoPanel = ({ config, clicked_coord, onHideModal }) => {
  const initial_thresholds = config.sliders.reduce(
    (o, el) => ({ ...o, [el.name]: el.initial_value }),
    {}
  );
  const [thresholds, set_thresholds] = useState(initial_thresholds);

  const modal = useRef(null);
  const canvas_width = 300;
  const canvas_height = 200;
  let canvasses, charts, arrs;

  function handle_threshold_change(event) {
    set_thresholds({ ...thresholds, [event.target.name]: +event.target.value });
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

  useEffect(() => {
    if (modal.current) return;
    const modal_div = document.querySelector("#example-modal");
    modal_div.addEventListener("hidden.bs.modal", onHideModal);
    modal.current = new Modal(modal_div);
  }, [onHideModal]);

  useEffect(() => {
    async function display_modal(coord) {
      console.log("Running modal");
      create_canvas_elements();

      const xy = project_point(coord.lng, coord.lat);
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
    }
    if (!modal.current || !clicked_coord) return;
    display_modal(clicked_coord).then(() => {
      console.log("Ready to show");
      modal.current.show();
    });
  }, [clicked_coord]);

  return (
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
                  The map on the left is refugial probability. Each map below is
                  a covariate that helps determine probability of refugia.
                </p>
                <p>Sliders:</p>
                <ul>
                  {Object.keys(thresholds).map((key) => (
                    <li key={key}>{thresholds[key]}</li>
                  ))}
                </ul>
                <SliderContainer
                  sliders={config.sliders}
                  onChange={handle_threshold_change}
                />
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
  );
};

export default DemoPanel;
