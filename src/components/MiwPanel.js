import React, { useRef, useState, useEffect, useCallback } from "react";
import { Modal } from "bootstrap";

import ResponseCanvas from "./ResponseCanvas";
import SliderContainer from "./SliderContainer";
import CovariateContainer from "./CovariateContainer";

export default function MiwPanel({
  config,
  miwResponseIdx,
  miwLocation,
  miwSize,
  onHide,
}) {
  const initialThresholds = config.sliders.reduce(
    (o, el) => ({ ...o, [el.name]: el.initial_value }),
    {}
  );
  const [thresholds, setThresholds] = useState(initialThresholds);
  // const [loadedImages, setLoadedImages] = useState({});
  // const [xy, setXy] = useState({ x: 0, y: 0 });
  // const modal = useRef(null);

  // const initImagesObject = useCallback(() => {
  //   function returnPaths(obj) {
  //     return obj.reduce(function (acc, cur) {
  //       acc[cur.geotiff_path] = false;
  //       return acc;
  //     }, {});
  //   }
  //   const covariates = returnPaths(config.covariates);
  //   const responses = returnPaths(config.responses);
  //   return { ...covariates, ...responses };
  // }, [config]);

  // const loaded = useCallback((key) => {
  //   setLoadedImages((s) => ({ ...s, [key]: true }));
  // }, []);

  // const handleThresholdChange = useCallback(
  //   (event) => {
  //     setThresholds({
  //       ...thresholds,
  //       [event.target.name]: +event.target.value,
  //     });
  //   },
  //   [thresholds]
  // );

  // const handleResponseMousemove = useCallback((event) => {
  //   const rect = event.target.getBoundingClientRect();
  //   const scaleX = event.target.width / rect.width;
  //   const scaleY = event.target.height / rect.height;
  //   const x = (event.clientX - rect.left) * scaleX;
  //   const y = (event.clientY - rect.top) * scaleY;
  //   setXy({ x: x, y: y });
  // }, []);

  // const clearLoadedImages = useCallback(() => {
  //   setLoadedImages(initImagesObject());
  // }, [initImagesObject]);

  const modal = useRef(null);
  // useEffect(() => {
  //   clearLoadedImages();
  // }, [clearLoadedImages]);

  useEffect(() => {
    if (modal.current) return;
    const modalDiv = document.querySelector("#miw-modal");
    modalDiv.addEventListener("hidden.bs.modal", clearLoadedImages);
    modalDiv.addEventListener("hidden.bs.modal", onHide);
    modal.current = new Modal(modalDiv);
  }, [onHide, clearLoadedImages]);

  useEffect(() => {
    if (!modal.current || !miwLocation) return;
    if (Object.values(loadedImages).every((i) => i === true)) {
      modal.current.show();
    }
  }, [miwLocation, loadedImages]);

  return (
    <div
      className="modal fade"
      id="miw-modal"
      tabIndex="-1"
      aria-labelledby="miw-model-label"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Model Inspector Window (MIW)</h5>
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
                  centerCoord={miwLocation}
                  width={miwSize[0]}
                  height={miwSize[1]}
                  currentIdx={currentIdx}
                  onMouseMove={handleResponseMousemove}
                  onLoaded={handleImageLoaded}
                />
              </div>
              <div id="ui" className="col-md-6">
                <p>
                  The map on the left is refugial probability. Each map below is
                  a covariate that helps determine probability of refugia. As
                  you mouse over the map on the left, the corresponding
                  covariates values at the mouse location are shown in the
                  response curves below.
                </p>
                <ResponseVariableDropdownGroup
                  variables={config.sliders[currentSurface].variables}
                  responses={thresholds}
                  onChange={handleThresholdChange}
                />
              </div>
            </div>
            <div className="row">
              <CovariateContainer
                covariates={config.covariates}
                centerCoord={miwLocation}
                width={miwSize[0]}
                height={miwSize[1]}
                xy={xy}
                onLoaded={handleImageLoaded}
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
}
