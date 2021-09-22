import React, { useRef, useState, useEffect, useCallback } from "react";
import { Modal } from "bootstrap";
import { isEqual } from "lodash";

import ResponseCanvas from "./ResponseCanvas";
import CovariateContainer from "./CovariateContainer";
import { ResponseVariableDropdownGroup } from "./Dropdown";

export default function MiwPanel({
  config,
  miwResponseIdx,
  miwLocation,
  miwSize,
  currentSurface,
  onHide,
}) {
  // Filter the response surfaces to just the ones with the currentSurface
  const responses = config.responses.filter(
    (r) => r.combination.surface === currentSurface
  );

  // Obtain the current values of the responses based on miwResponseIdx
  const currentResponses = { ...config.responses[miwResponseIdx].combination };
  delete currentResponses.surface;

  // Set state for current values of thresholds and index
  const [thresholds, setThresholds] = useState(currentResponses);
  const [currentIdx, setCurrentIdx] = useState(miwResponseIdx);

  // Initialize the loadedImages object to track which images have
  // finished loading into canvas objects
  const initImagesObject = useCallback(() => {
    function returnPaths(obj) {
      return obj.reduce(function (acc, cur) {
        acc[cur.geotiff_path] = false;
        return acc;
      }, {});
    }

    const covariatePaths = returnPaths(config.covariates);
    const responsePaths = returnPaths(responses);
    return { ...covariatePaths, ...responsePaths };
  }, [config.covariates, responses]);

  const [loadedImages, setLoadedImages] = useState(initImagesObject);
  const [xy, setXy] = useState({ x: 0, y: 0 });
  const modal = useRef(null);

  // Function to fire when an individual image has loaded.  This
  // updates the loadedImages object for this variable
  const handleImageLoaded = useCallback((key) => {
    setLoadedImages((s) => ({ ...s, [key]: true }));
  }, []);

  const handleThresholdChange = useCallback(
    (obj) => {
      setThresholds({
        ...thresholds,
        ...obj,
      });
    },
    [thresholds]
  );

  useEffect(() => {
    if (!thresholds) return;
    const comb = { ...thresholds, surface: currentSurface };
    const idx = responses.findIndex((r) => isEqual(r.combination, comb));
    setCurrentIdx(idx);
  }, [thresholds, responses, currentSurface]);

  const handleResponseMousemove = useCallback((event) => {
    const rect = event.target.getBoundingClientRect();
    const scaleX = event.target.width / rect.width;
    const scaleY = event.target.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    setXy({ x: x, y: y });
  }, []);

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
