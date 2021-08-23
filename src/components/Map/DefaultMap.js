import React, { useRef, useState, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import { mapbox_token } from "./token";
mapboxgl.accessToken = mapbox_token;

export default function DefaultMap({
  base_style,
  initial_view = { lng: -123.0, lat: 44.0, zoom: 10 },
  on_loaded = () => {},
}) {
  const container = useRef(null);
  const [map, set_map] = useState(null);

  // Initialize map
  useEffect(() => {
    if (map) return;
    set_map(
      new mapboxgl.Map({
        container: container.current,
        style: base_style,
        center: [initial_view.lng, initial_view.lat],
        zoom: initial_view.zoom,
      })
    );
  }, [map, base_style, initial_view]);

  // Call on_loaded once the map loads
  useEffect(() => {
    if (!map) return;
    map.on("load", () => {
      on_loaded(map);
    });
  }, [map, on_loaded]);

  return <div ref={container} className="map"></div>;
}
