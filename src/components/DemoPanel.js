import React, { useRef, useState, useEffect } from "react";
import { Modal } from "bootstrap";

import ResponseCanvas from "./ResponseCanvas";
import SliderContainer from "./SliderContainer";
import CovariateContainer from "./CovariateContainer";

// Functions remaining to refactor

// function change_dots(charts, arrs, offset) {
//   zip([charts, arrs]).forEach((t) => {
//     const [chart, arr] = t;
//     const pix =
//       (arr[0][offset] - d3.min(arr[0])) / (d3.max(arr[0]) - d3.min(arr[0]));
//     // change_dot(chart, pix);
//   });
// }

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

const DemoPanel = ({ config, clicked_coord, onHideModal }) => {
  const initial_thresholds = config.sliders.reduce(
    (o, el) => ({ ...o, [el.name]: el.initial_value }),
    {}
  );
  const [thresholds, set_thresholds] = useState(initial_thresholds);
  const modal = useRef(null);

  function handle_threshold_change(event) {
    set_thresholds({ ...thresholds, [event.target.name]: +event.target.value });
  }

  useEffect(() => {
    if (modal.current) return;
    const modal_div = document.querySelector("#example-modal");
    modal_div.addEventListener("hidden.bs.modal", onHideModal);
    modal.current = new Modal(modal_div);
  }, [onHideModal]);

  useEffect(() => {
    if (!modal.current || !clicked_coord) return;
    modal.current.show();
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
              <div id="response-panel" className="col-md-6">
                <ResponseCanvas
                  responses={config.responses}
                  clicked_coord={clicked_coord}
                />
              </div>
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
                clicked_coord={clicked_coord}
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
