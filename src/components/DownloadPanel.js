import React, { useEffect, useState, useReducer } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import DownloadButton from "./DownloadButton";
import { ResponseVariableDropdown } from "./Dropdown";

export function DownloadDropdown({
  config,
  selectedSurface,
  selectedScenario,
  onSurfaceChange,
  onScenarioChange,
}) {
  const surfaceOptions = config.probability_surfaces.map((s, i) => {
    return { value: i, label: s.description };
  });
  const scenarioOptions = [
    { value: 0, label: "Mild" },
    { value: 1, label: "Moderate" },
    { value: 2, label: "Extreme" },
  ];
  return (
    <Form.Group className="mb-3 mt-2">
      <ResponseVariableDropdown
        name="surface"
        title="Probability Surface"
        options={surfaceOptions}
        selected={selectedSurface}
        className="mt-1"
        onChange={onSurfaceChange}
      />
      <ResponseVariableDropdown
        name="scenario"
        title="Fire Weather Extremity Scenario"
        options={scenarioOptions}
        selected={selectedScenario}
        className="mt-1"
        onChange={onScenarioChange}
      />
    </Form.Group>
  );
}

export default function DownloadPanel({ config, show, onHide }) {
  const [surface, setSurface] = useState(0);
  const [scenario, setScenario] = useState(1);
  const [downloadHref, setDownloadHref] = useState(0);

  const handleSurfaceChange = (event) => {
    const value = +Object.values(event)[0];
    setSurface(value);
  };

  const handleScenarioChange = (event) => {
    const value = +Object.values(event)[0];
    setScenario(value);
  };

  useEffect(() => {
    const surfaceConfig = config.probability_surfaces[surface];
    const responseConfig = surfaceConfig.responses[scenario];
    const href =
      window.location.protocol +
      "//" +
      window.location.host +
      responseConfig.zip_path;
    setDownloadHref(href);
  }, [config.probability_surfaces, surface, scenario]);

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
        <DownloadDropdown
          config={config}
          selectedSurface={surface}
          selectedScenario={scenario}
          onSurfaceChange={handleSurfaceChange}
          onScenarioChange={handleScenarioChange}
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
