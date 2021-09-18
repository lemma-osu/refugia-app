import React, { useEffect, useState, useReducer } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import ResponseMap from "./ResponseMap";
import DemoPanel from "./DemoPanel";
import { ResponseSurfaceDropdown, MiwDropdown } from "./Dropdown";
import IntroductionPanel from "./IntroductionPanel";
import ColorRamp from "./ColorRamp";
import { isEqual } from "lodash";

const MIW_SIZES = {
  0: [300, 200],
  1: [600, 400],
};

// Function to set the default values for the varying variables
// for each of the response surfaces
const getDefaultResponses = (config) => {
  return config.sliders.reduce(
    (obj, el, idx) => ({
      ...obj,
      [idx]: el.variables.reduce(
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

  const [clickedCoord, setClickedCoord] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [idx, setIdx] = useState(0);
  const [miwSize, setMiwSize] = useState([300, 200]);

  // Event handlers
  const handleCloseIntro = () => setShowIntro(false);
  const handleShowIntro = () => setShowIntro(true);

  function handleModalClose() {
    setClickedCoord(null);
  }

  const handleSurfaceChange = (event) => {
    dispatch({ type: "SET_SURFACE", payload: +event.target.value });
  };

  const handleResponseChange = (changed) => {
    const responses = { ...state.responses, ...changed };
    dispatch({ type: "SET_RESPONSES", payload: responses });
  };

  const handleChangeMiw = (event) => {
    setMiwSize(MIW_SIZES[+event.target.value]);
  };

  useEffect(() => {
    setIdx(
      config.responses.findIndex((r) => isEqual(r.combination, responses))
    );
  }, [config, responses]);

  return (
    <>
      <ResponseMap
        config={config}
        idx={idx}
        miwSize={miwSize}
        onClickedCoord={setClickedCoord}
      />

      <Card
        bg="dark"
        text="white"
        className="m-3"
        style={{ maxWidth: "20rem", height: "calc(100vh - 32px)" }}
      >
        <Card.Body>
          <Card.Title>EcoVis</Card.Title>
          <div className="d-grid">
            <Button variant="primary" onClick={handleShowIntro}>
              Show Introduction
            </Button>
          </div>
          <ResponseSurfaceDropdown
            config={config}
            surface={state.surface}
            responses={state.responses}
            onSurfaceChange={handleSurfaceChange}
            onResponseChange={handleResponseChange}
          />
          <MiwDropdown onChange={handleChangeMiw} />
          <ColorRamp />
          <div className="d-grid">
            <Button variant="success" onClick={handleShowIntro}>
              To the MIW!!!
            </Button>
          </div>
        </Card.Body>
      </Card>

      <IntroductionPanel
        title="EcoVis Tool"
        show={showIntro}
        onHide={handleCloseIntro}
      />
    </>
  );

  // <DemoPanel
  //   config={config}
  //   clickedCoord={clickedCoord}
  //   onHideModal={handleModalClose}
  // />
}
