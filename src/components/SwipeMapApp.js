import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import Card from "react-bootstrap/Card";

import DefaultMap from "./Map/DefaultMap";
// import CustomLayerMap from "./Map/CustomLayerMap";
import CustomMultiLayerMap from "./Map/CustomMultiLayerMap";
import SwipeMap from "./Map/SwipeMap";

function Dropdown({ onChange }) {
  return (
    <select onChange={(e) => onChange(e.currentTarget.value)}>
      <option value="0">nofp</option>
      <option value="1">ogsi</option>
      <option value="2">op</option>
    </select>
  );
}

export default function SwipeMapApp() {
  const [config, setConfig] = useState(null);
  const [idx, setIdx] = useState();
  const [map, setMap] = useState(null);
  let { url } = useRouteMatch();

  function handleMapLoad(compareMaps) {
    setMap(compareMaps.left);
  }

  useEffect(() => {
    if (config) return;
    const configFn = `${url}/config.json`;
    fetch(configFn)
      .then((response) => response.json())
      .then((data) => {
        setConfig(data);
      });
  }, [config, url]);

  const changeIndex = (value) => {
    setIdx(+value);
  };

  // Swipe with base (left) and multiple custom layers (right)
  return (
    <>
      {config && (
        <SwipeMap
          left={
            <CustomMultiLayerMap
              baseStyle="mapbox://styles/mapbox/dark-v10"
              initialView={{
                lng: config.initial_lng,
                lat: config.initial_lat,
                zoom: config.initial_zoom,
              }}
              customLayers={config.tiles}
              layerIdx={idx}
            />
          }
          right={
            <DefaultMap
              baseStyle="mapbox://styles/mapbox/satellite-streets-v11"
              initialView={{
                lng: config.initial_lng,
                lat: config.initial_lat,
                zoom: config.initial_zoom,
              }}
            />
          }
          onLoaded={handleMapLoad}
        />
      )}
      <Card
        bg="dark"
        text="white"
        className="m-3"
        style={{ maxWidth: "20rem", height: "calc(100vh - 32px)" }}
      >
        <Card.Body>
          <Card.Title>Swipe Example</Card.Title>
          <Dropdown onChange={changeIndex} />
        </Card.Body>
      </Card>
    </>
  );
}
