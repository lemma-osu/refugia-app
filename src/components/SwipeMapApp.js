import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";

import DefaultMap from "./Map/DefaultMap";
// import CustomLayerMap from "./Map/CustomLayerMap";
import CustomMultiLayerMap from "./Map/CustomMultiLayerMap";
import SwipeMap from "./Map/SwipeMap";
import Card, { Dropdown } from "./Card";

export default function SwipeMapApp() {
  const [config, setConfig] = useState(null);
  const [idx, setIdx] = useState();
  let { url } = useRouteMatch();

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

  // // Swipe with base (left) and custom layer (right)
  // return (
  //   <>
  //     {config && (
  //       <SwipeMap
  //         left={
  //           <CustomLayerMap
  //             baseStyle="mapbox://styles/mapbox/dark-v10"
  //             customLayer={config.tiles[0]}
  //           />
  //         }
  //         right={
  //           <DefaultMap baseStyle="mapbox://styles/mapbox/satellite-streets-v11" />
  //         }
  //       />
  //     )}
  //   </>
  // );

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
        />
      )}
      <Card>
        <Dropdown onChange={changeIndex} />
      </Card>
    </>
  );
}
