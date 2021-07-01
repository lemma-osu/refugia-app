import React, { useRef, useState, useEffect } from "react";
import { Modal } from "bootstrap";
import * as d3 from "d3";
import { plot as Plot } from "plotty";

import { project_point } from "../projection";
import { read_raster_definitions, read_tiffs, zip } from "../utils";

import SliderContainer from "./SliderContainer";
import CovariateContainer from "./CovariateContainer";

const DemoPanel = ({ config, clicked_coord, onHideModal }) => {
  const initial_thresholds = config.sliders.reduce(
    (o, el) => ({ ...o, [el.name]: el.initial_value }),
    {}
  );
  const [thresholds, set_thresholds] = useState(initial_thresholds);

  const modal = useRef(null);
  const canvas_width = 300;
  const canvas_height = 200;
  let canvasses, arrs;

  function handle_threshold_change(event) {
    set_thresholds({ ...thresholds, [event.target.name]: +event.target.value });
  }

  function change_dots(charts, arrs, offset) {
    zip([charts, arrs]).forEach((t) => {
      const [chart, arr] = t;
      const pix =
        (arr[0][offset] - d3.min(arr[0])) / (d3.max(arr[0]) - d3.min(arr[0]));
      // change_dot(chart, pix);
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

  useEffect(() => {
    if (modal.current) return;
    const modal_div = document.querySelector("#example-modal");
    modal_div.addEventListener("hidden.bs.modal", onHideModal);
    modal.current = new Modal(modal_div);
  }, [onHideModal]);

  useEffect(() => {
    async function display_modal(coord) {
      console.log("Running modal");

      // const xy = project_point(coord.lng, coord.lat);
      // const img_defs = await read_raster_definitions(
      //   config.geotiffs,
      //   xy,
      //   canvas_width,
      //   canvas_height
      // );
      // arrs = await read_tiffs(img_defs);
      // update_canvasses(canvasses, arrs);

      // // Create event listener for response canvas
      // const response_canvas = canvasses[0];
      // const covariate_arrs = arrs.slice(1);
      // response_canvas.addEventListener("mousemove", function (e) {
      //   const rect = response_canvas.getBoundingClientRect();
      //   const x = e.clientX - rect.left;
      //   const y = e.clientY - rect.top;
      //   const canvas_x = parseInt(response_canvas.width * (x / rect.width), 10);
      //   const canvas_y = parseInt(
      //     response_canvas.height * (y / rect.height),
      //     10
      //   );
      //   const offset = canvas_y * response_canvas.height + canvas_x;
      //   change_dots(charts, covariate_arrs, offset);
      // });
    }
    if (!modal.current || !clicked_coord) return;
    display_modal(clicked_coord).then(() => {
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
              <CovariateContainer
                covariates={config.covariates}
                threshold={0}
              />
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
