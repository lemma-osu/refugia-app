import React, { useRef, useState, useEffect } from "react";
import { Modal } from "bootstrap";

import ResponseCanvas from "./ResponseCanvas";
import SliderContainer from "./SliderContainer";
import CovariateContainer from "./CovariateContainer";

const DemoPanel = ({ config, clicked_coord, onHideModal }) => {
  const initial_thresholds = config.sliders.reduce(
    (o, el) => ({ ...o, [el.name]: el.initial_value }),
    {}
  );
  const [thresholds, set_thresholds] = useState(initial_thresholds);
  const [xy, set_xy] = useState({ x: 0, y: 0 });
  const modal = useRef(null);

  function handle_threshold_change(event) {
    set_thresholds({ ...thresholds, [event.target.name]: +event.target.value });
  }

  function handle_response_mousemove(event) {
    const rect = event.target.getBoundingClientRect();
    const scale_x = event.target.width / rect.width;
    const scale_y = event.target.height / rect.height;
    const x = (event.clientX - rect.left) * scale_x;
    const y = (event.clientY - rect.top) * scale_y;
    set_xy({ x: x, y: y });
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
                  thresholds={thresholds}
                  onMouseMove={handle_response_mousemove}
                />
              </div>
              <div id="ui" className="col-md-6">
                <p>
                  The map on the left is refugial probability. Each map below is
                  a covariate that helps determine probability of refugia.
                </p>
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
                xy={xy}
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
