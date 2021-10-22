import React, {
  useEffect,
  useState,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import ResponseMap from "./ResponseMap";
import MiwPanel from "./MiwPanel";
import { ResponseVariableDropdown, MiwDropdown } from "./Dropdown";
import IntroductionPanel from "./IntroductionPanel";
import HowToPanel from "./HowToPanel";
import DownloadPanel from "./DownloadPanel";
import ColorRamp from "./ColorRamp";

const MIW_SIZES = {
  0: [150, 100],
  1: [300, 200],
  2: [600, 400],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SURFACE":
      return {
        ...state,
        surface: action.payload,
      };

    case "SET_SCENARIO":
      return {
        ...state,
        scenario: action.payload,
      };

    default:
      return state;
  }
}

const introText1 = (
  <div className="small">
    Explore predictive ecological maps of fire refugia and high severity fire
    for forests of the Pacific Northwest. Pan, zoom in-out, swipe between
    predicted and actual conditions, change fire weather scenarios, examine the
    influence of predictor variables, and download data directly. Use the Model
    Inspector Window (MIW; yellow box on map) for detailed assessment. For
    background and details on data products and for using Eco-Vis:
  </div>
);

const introText2 = (
  <div className="small">
    Explainer on how to best use the features of the Eco-Vis webapp:
  </div>
);

const scenarioOptions = [
  { value: 0, label: "Mild (90th RH, 10th Tmmx)" },
  { value: 1, label: "Moderate (50th RH, 50th Tmmx)" },
  { value: 2, label: "Extreme (10th RH, 90th Tmmx)" },
];

export default function App({ config }) {
  const [state, dispatch] = useReducer(reducer, { surface: 0, scenario: 1 });
  const [location, setLocation] = useState({
    lng: config.map.initial_lng,
    lat: config.map.initial_lat,
  });
  const [miwLocation, setMiwLocation] = useState({
    lng: config.map.initial_lng,
    lat: config.map.initial_lat,
  });
  const [region, setRegion] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showMiw, setShowMiw] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [tileIdx, setTileIdx] = useState(0);
  const [miwResponseIdx, setMiwResponseIdx] = useState(0);
  const [miwSize, setMiwSize] = useState([300, 200]);
  const [miwRecenter, setMiwRecenter] = useState(false);
  const [ramp, setRamp] = useState(() => {
    var key = config.probability_surfaces[state.surface].color_ramp;
    return config.color_ramps[key];
  });

  const surfaceOptions = useMemo(() => {
    return config.probability_surfaces.map((s, i) => {
      return { value: i, label: s.description };
    });
  }, [config]);

  // Event handlers
  const handleIntroClose = () => setShowIntro(false);
  const handleIntroShow = () => setShowIntro(true);
  const handleHowToClose = () => setShowHowTo(false);
  const handleHowToShow = () => setShowHowTo(true);
  const handleMiwClose = () => setShowMiw(false);
  const handleMiwShow = () => setShowMiw(true);
  const handleMiwRecenter = () => setMiwRecenter(true);
  const handleDownloadClose = () => setShowDownload(false);
  const handleDownloadShow = () => setShowDownload(true);

  const handleSurfaceChange = (event) => {
    dispatch({ type: "SET_SURFACE", payload: +event.target.value });
  };

  const handleScenarioChange = (event) => {
    dispatch({ type: "SET_SCENARIO", payload: +event.target.value });
  };

  const handleMiwSizeChange = (event) => {
    setMiwSize(MIW_SIZES[+event.target.value]);
  };

  const handleLocationChange = useCallback((event) => {
    setLocation(event.lngLat);
  }, []);

  const handleMiwLocationChange = useCallback(({ coord, region }) => {
    setMiwLocation(coord);
    setRegion(region);
    setMiwRecenter(false);
  }, []);

  useEffect(() => {
    setTileIdx(state.scenario);
    setMiwResponseIdx(state.scenario);
  }, [state.scenario]);

  useEffect(() => {
    const key = config.probability_surfaces[state.surface].color_ramp;
    setRamp(config.color_ramps[key]);
  }, [config, state.surface]);

  return (
    <>
      <ResponseMap
        tiles={config.probability_surfaces[state.surface].responses}
        regionGeojson={config.region_geojson}
        idx={tileIdx}
        miwSize={miwSize}
        miwRecenter={miwRecenter}
        initialLng={config.map.initial_lng}
        initialLat={config.map.initial_lat}
        initialZoom={config.map.initial_zoom}
        onMouseMove={handleLocationChange}
        onMiwMove={handleMiwLocationChange}
      />

      <Card
        id="vis-card"
        bg="dark"
        text="white"
        className="m-3"
        style={{ maxWidth: "20rem", height: "calc(100vh - 32px)" }}
      >
        <Card.Body>
          <Card.Title>Welcome to Eco-Vis!</Card.Title>
          <div className="d-grid gap-2">
            <div>{introText1}</div>
            <Button
              className="btn-custom"
              variant="primary"
              onClick={handleIntroShow}
            >
              Show Introduction
            </Button>
            <div>{introText2}</div>
            <Button
              className="btn-custom"
              variant="primary"
              onClick={handleHowToShow}
            >
              How-To
            </Button>
          </div>
          <div className="mt-2">
            <div className="small">
              Latitude: {location.lat.toFixed(4)} | Longitude:{" "}
              {location.lng.toFixed(4)}
            </div>
          </div>
          <ResponseVariableDropdown
            name="surface"
            title="Probability Map"
            options={surfaceOptions}
            selected={state.surface}
            className="mt-1"
            onChange={handleSurfaceChange}
          />
          <ResponseVariableDropdown
            name="scenario"
            title="Fire Weather Extremity Scenario"
            options={scenarioOptions}
            selected={state.scenario}
            className="mt-1 mb-2"
            onChange={handleScenarioChange}
          />
          <ColorRamp specification={ramp} width={286} height={30} />
          <MiwDropdown onChange={handleMiwSizeChange} />
          <div className="d-grid gap-2">
            <Button
              className="btn-custom"
              variant="success"
              onClick={handleMiwShow}
            >
              To the MIW!
            </Button>
            <Button
              className="btn-custom"
              variant="success"
              onClick={handleMiwRecenter}
            >
              Recenter MIW Window
            </Button>
            <Button
              className="btn-custom"
              variant="success"
              onClick={handleDownloadShow}
            >
              Download Data
            </Button>
          </div>
        </Card.Body>
      </Card>

      <IntroductionPanel
        title="EcoVis Tool"
        show={showIntro}
        onHide={handleIntroClose}
      />

      <HowToPanel title="How-To" show={showHowTo} onHide={handleHowToClose} />

      <DownloadPanel
        config={config}
        show={showDownload}
        onHide={handleDownloadClose}
      />

      {showMiw && (
        <MiwPanel
          config={config}
          miwResponseIdx={miwResponseIdx}
          miwLocation={miwLocation}
          miwSize={miwSize}
          currentSurface={state.surface}
          currentRegion={region}
          ramp={ramp}
          onHide={handleMiwClose}
        />
      )}
    </>
  );
}
