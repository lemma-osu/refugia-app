import React, { useState } from "react";

import ResponseMap from "./ResponseMap";
import DemoPanel from "./DemoPanel";
import { ResponseDropdown } from "./Card";

export default function App({ config }) {
  const [clickedCoord, setClickedCoord] = useState(null);
  const [idx, setIdx] = useState(0);


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
      <div
        className="card text-white bg-dark m-3"
        style={{ maxWidth: "20rem", height: "calc(100vh - 32px)" }}
      >
        <div className="card-body">
          <h5 className="card-title">Fire Refugia Demonstration</h5>
          <p className="card-text">
            This application is pretty much the coolest application in the
            entire world even though it basically does nothing at present. This
            card gives information about the map to the right and provides the
            instructions to the user on how to create the modal for a particular
            study area.
          </p>
          <p className="card-text">
            To enable the modal demonstration, zoom in to an extent where the
            cursor changes to a crosshair and double click the button. This will
            load the modal window and show the demonstration.
          </p>
          <ResponseDropdown config={config} on_change={handle_change_index} />
        </div>
      </div>
    </>
  );

  // <DemoPanel
  //   config={config}
  //   clickedCoord={clickedCoord}
  //   onHideModal={handleModalClose}
  // />
}
