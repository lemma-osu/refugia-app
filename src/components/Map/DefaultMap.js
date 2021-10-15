import React, { useRef, useState, useEffect } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
// import mapboxgl from "mapbox-gl/dist/mapbox-gl-dev";

import { mapboxToken } from "./token";
mapboxgl.accessToken = mapboxToken;

export default function DefaultMap({
  baseStyle,
  initialView = { lng: -123.0, lat: 44.0, zoom: 10 },
  onLoaded,
}) {
  const container = useRef(null);
  const [map, setMap] = useState(null);

  // Initialize map
  useEffect(() => {
    if (map) return;
    setMap(
      new mapboxgl.Map({
        container: container.current,
        style: baseStyle,
        center: [initialView.lng, initialView.lat],
        zoom: initialView.zoom,
        maxZoom: initialView.maxZoom,
      })
    );
  }, [map, baseStyle, initialView]);

  // Call onLoaded once the map loads
  useEffect(() => {
    if (!map) return;
    map.on("load", () => {
      onLoaded(map);
    });
  }, [map, onLoaded]);

  return <div ref={container} className="map"></div>;
}
