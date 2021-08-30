import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import ResponseMap from "./ResponseMap";
import DemoPanel from "./DemoPanel";
import { ResponseDropdown } from "./Card";
import IntroductionPanel from "./IntroductionPanel";

export default function App({ config }) {
  const [clickedCoord, setClickedCoord] = useState(null);
  const [showIntro, setShowIntro] = useState(false);
  const [idx, setIdx] = useState(0);

  // Event handlers
  const handleCloseIntro = () => setShowIntro(false);
  const handleShowIntro = () => setShowIntro(true);

  function handleModalClose() {
    setClickedCoord(null);
  }

  return (
    <>
      <ResponseMap
        config={config}
        idx={idx}
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
