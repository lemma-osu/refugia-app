import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";

import DefaultMap from "./Map/DefaultMap";
import CustomLayerMap from "./Map/CustomLayerMap";
import CustomMultiLayerMap from "./Map/CustomMultiLayerMap";
import SwipeMap from "./Map/SwipeMap";
import Card, { Dropdown } from "./Card";

export default function SwipeMapApp() {
  const [config, set_config] = useState(null);
  const [idx, set_idx] = useState();
  let { url } = useRouteMatch();

  useEffect(() => {
    if (config) return;
    const config_fn = `${url}/config.json`;
    fetch(config_fn)
      .then((response) => response.json())
      .then((data) => {
        set_config(data);
      });
  }, [config, url]);

  const change_index = (value) => {
    set_idx(+value);
  };

  // // Swipe with base (left) and custom layer (right)
  // return (
  //   <>
  //     {config && (
  //       <SwipeMap
  //         left={
  //           <CustomLayerMap
  //             base_style="mapbox://styles/mapbox/dark-v10"
  //             custom_layer={config.tiles[0]}
  //           />
  //         }
  //         right={
  //           <DefaultMap base_style="mapbox://styles/mapbox/satellite-streets-v11" />
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
              base_style="mapbox://styles/mapbox/dark-v10"
              initial_view={{
                lng: config.initial_lng,
                lat: config.initial_lat,
                zoom: config.initial_zoom,
              }}
              custom_layers={config.tiles}
              layer_idx={idx}
            />
          }
          right={
            <DefaultMap
              base_style="mapbox://styles/mapbox/satellite-streets-v11"
              initial_view={{
                lng: config.initial_lng,
                lat: config.initial_lat,
                zoom: config.initial_zoom,
              }}
            />
          }
        />
      )}
      <Card>
        <Dropdown on_change={change_index} />
      </Card>
    </>
  );
}
