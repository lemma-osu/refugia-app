import React, { useEffect, useState } from "react";
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
    { value: 0, label: "Mild (90th RH, 10th Tmmx)" },
    { value: 1, label: "Moderate (50th RH, 50th Tmmx)" },
    { value: 2, label: "Extreme (10th RH, 90th Tmmx)" },
  ];
  return (
    <Form.Group className="mb-2 mt-2">
      <ResponseVariableDropdown
        name="surface"
        title="Probability Map"
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
    setSurface(+event.target.value);
  };

  const handleScenarioChange = (event) => {
    setScenario(+event.target.value);
  };

  const shapefileHref =
    window.location.protocol +
    "//" +
    window.location.host +
    config.zipped_shapefile;

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
    <Modal
      id="download-panel"
      show={show}
      onHide={onHide}
      dialogClassName="modal-50w"
    >
      <Modal.Header closeButton>
        <Modal.Title>Download Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <small>
          To download the probability maps, specify the desired probability map
          and scenario. Then press the “Download Selected Probability Map”
          button to start the download. Your file will be provided as a
          compressed (zipped) GeoTiff file. In order to create smaller rasters,
          probability scores have been multiplied by 10000 and converted to
          integer rasters (e.g. 0.5 becomes 5000).
        </small>
        <DownloadDropdown
          config={config}
          selectedSurface={surface}
          selectedScenario={scenario}
          onSurfaceChange={handleSurfaceChange}
          onScenarioChange={handleScenarioChange}
        />
        <div className="mt-1 mb-1">
          <small>
            The rasters are stored in Web Mercator projection (EPSG:3857) and
            should be viewable in most desktop GIS programs (e.g. ArcGIS, QGIS).
          </small>
        </div>
        <div className="d-grid">
          <DownloadButton
            title="Download Selected Probability Map"
            href={downloadHref}
          />
        </div>
        <div className="mt-1 mb-1">
          <small>
            A zipped shapefile of the ecoregional boundaries used for modeling
            are available below.
          </small>
        </div>
        <div className="d-grid">
          <DownloadButton
            title="Download Ecoregion Boundaries (SHP)"
            href={shapefileHref}
          />
        </div>
        <div className="mt-2">
          <small>
            Additional context, literature on fire refugia, and documentation
            for this project can be found at:{" "}
            <a
              href="http://firerefugia.forestry.oregonstate.edu/home"
              target="_blank"
              rel="noopener noreferrer"
            >
              http://firerefugia.forestry.oregonstate.edu/home
            </a>
            .
            <br />
            For questions and comments, please email: Dr. Meg A. Krawchuk,
            meg.krawchuk [at] oregonstate.edu for contact/help/information.
          </small>
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
