import React, { useEffect, useState, useReducer, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import ResponseMap from "./ResponseMap";
import MiwPanel from "./MiwPanel";
import { ResponseSurfaceDropdown, MiwDropdown } from "./Dropdown";
import IntroductionPanel from "./IntroductionPanel";
import ColorRamp from "./ColorRamp";
import { isEqual } from "lodash";

const MIW_SIZES = {
  0: [150, 100],
  1: [300, 200],
  2: [600, 400],
};

// Function to set the default values for the varying variables
// for each of the response surfaces
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

export default function App({ config }) {
  const [state, dispatch] = useReducer(reducer, config, initializeState);
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
  const [showMiw, setShowMiw] = useState(false);
  const [tileIdx, setTileIdx] = useState(0);
  const [miwResponseIdx, setMiwResponseIdx] = useState(0);
  const [miwSize, setMiwSize] = useState([300, 200]);
  const [ramp, setRamp] = useState(() => {
    var key = config.probability_surfaces[state.surface].color_ramp;
    return config.color_ramps[key];
  });

  // Event handlers
  const handleIntroClose = () => setShowIntro(false);
  const handleIntroShow = () => setShowIntro(true);
  const handleMiwClose = () => setShowMiw(false);
  const handleMiwShow = () => setShowMiw(true);

  const handleSurfaceChange = (event) => {
    dispatch({ type: "SET_SURFACE", payload: +event.target.value });
  };

  const handleResponseChange = (changed) => {
    const responses = { ...state.responses, ...changed };
    dispatch({ type: "SET_RESPONSES", payload: responses });
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
  }, []);

  useEffect(() => {
    const surface = config.probability_surfaces[state.surface];
    const responses = surface.responses;
    setTileIdx(
      responses.findIndex((r) => isEqual(r.combination, state.responses))
    );
    setMiwResponseIdx(
      responses.findIndex((r) => isEqual(r.combination, state.responses))
    );
  }, [config, state.surface, state.responses]);

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
        initialLng={config.map.initial_lng}
        initialLat={config.map.initial_lat}
        initialZoom={config.map.initial_zoom}
        onMouseMove={handleLocationChange}
        onMiwMove={handleMiwLocationChange}
      />

      <Card
        bg="dark"
        text="white"
        className="m-3"
        style={{ maxWidth: "20rem", height: "calc(100vh - 32px)" }}
      >
        <Card.Body>
          <Card.Title>Eco-Vis</Card.Title>
          <div className="pb-3">
            Placeholder text for any descriptive text of Eco-Vis that users
            should have before hitting the "Show Introduction" button
          </div>
          <div className="d-grid">
            <Button variant="primary" onClick={handleIntroShow}>
              Show Introduction
            </Button>
          </div>
          <div className="mt-3">
            Latitude: {location.lat.toFixed(4)} | Longitude:{" "}
            {location.lng.toFixed(4)}
          </div>
          <ResponseSurfaceDropdown
            config={config}
            surface={state.surface}
            responses={state.responses}
            onSurfaceChange={handleSurfaceChange}
            onResponseChange={handleResponseChange}
          />
          <MiwDropdown onChange={handleMiwSizeChange} />
          <ColorRamp specification={ramp} width={286} height={30} />
          <div className="d-grid gap-3">
            <Button variant="success" onClick={handleMiwShow}>
              To the MIW!!!
            </Button>
            <Button variant="success" onClick={handleIntroShow}>
              Download Current Probability Map
              <br />
              <small>This will download the entire region</small>
            </Button>
          </div>
        </Card.Body>
      </Card>

      <IntroductionPanel
        title="EcoVis Tool"
        show={showIntro}
        onHide={handleIntroClose}
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
