import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import ResponseMap from "./ResponseMap";
import DemoPanel from "./DemoPanel";
import { ResponseDropdown, MiwDropdown } from "./Dropdown";
import IntroductionPanel from "./IntroductionPanel";
import ColorRamp from "./ColorRamp";
import { isEqual } from "lodash";

const MIW_SIZES = {
  0: [300, 200],
  1: [600, 400],
};

export default function App({ config }) {
  const initialResponses = config.sliders.reduce(
    (o, el) => ({ ...o, [el.name]: el.initial_value }),
    {}
  );
  const [responses, setResponses] = useState(initialResponses);

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

  const handleChangeResponse = (event) => {
    setResponses({
      ...responses,
      [event.target.name]: +event.target.value,
    });
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
          <ResponseDropdown config={config} onChange={handleChangeResponse} />
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
