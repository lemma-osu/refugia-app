import React, { useEffect, useState, useReducer } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { isEqual } from "lodash";

import { ResponseSurfaceDropdown } from "./Dropdown";
import DownloadButton from "./DownloadButton";

const getDefaultResponses = (config) => {
  return config.probability_surfaces.reduce(
    (obj, el, idx) => ({
      ...obj,
      [idx]: el.realizations.reduce(
        (obj, el) => ({ ...obj, [el.name]: el.initial_value }),
        {}
      ),
    }),
    {}
  );
};

const initializeState = (config) => {
  const defaultResponses = getDefaultResponses(config);
  return {
    surface: 0,
    responses: defaultResponses[0],
    defaultResponses: defaultResponses,
  };
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SURFACE":
      return {
        ...state,
        surface: action.payload,
        responses: state.defaultResponses[action.payload],
      };

    case "SET_RESPONSES":
      return {
        ...state,
        responses: action.payload,
      };

    default:
      return state;
  }
}

export default function DownloadPanel({ config, show, onHide }) {
  const [state, dispatch] = useReducer(reducer, config, initializeState);
  const [downloadHref, setDownloadHref] = useState(0);

  const handleSurfaceChange = (event) => {
    dispatch({ type: "SET_SURFACE", payload: +event.target.value });
  };

  const handleResponseChange = (changed) => {
    // Commented out for now - this allows independent varying of
    // response variables.  Currently we're doing this as paired such
    // that any response change triggers a value change in all reponses
    // const responses = { ...state.responses, ...changed };
    const value = Object.values(changed)[0];
    const responses = Object.keys(state.responses).reduce(
      (obj, el) => ({
        ...obj,
        [el]: value,
      }),
      {}
    );
    dispatch({ type: "SET_RESPONSES", payload: responses });
  };

  useEffect(() => {
    const surface = config.probability_surfaces[state.surface];
    const responseConfig = surface.responses.find((r) =>
      isEqual(r.combination, state.responses)
    );
    const href =
      window.location.protocol +
      "//" +
      window.location.host +
      responseConfig.zip_path;
    setDownloadHref(href);
  });

  return (
    <Modal show={show} onHide={onHide} dialogClassName="modal-50w">
      <Modal.Header closeButton>
        <Modal.Title>Download Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          To download the probability maps, specify the desired response surface
          and scenario. Then press the “Download Selected Probability Map”
          button to start the download. Your file will be provided a compressed
          (zipped) file. A shapefile of our the ecoregional boundaries used for
          modeling are available here.
        </p>
        <ResponseSurfaceDropdown
          config={config}
          surface={state.surface}
          responses={state.responses}
          onSurfaceChange={handleSurfaceChange}
          onResponseChange={handleResponseChange}
        />
        <div className="d-grid">
          <DownloadButton
            title="Download Selected Probability Map"
            href={downloadHref}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
