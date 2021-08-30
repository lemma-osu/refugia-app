import React, { useState, useEffect, useCallback } from "react";
import DefaultMap from "./DefaultMap";
import { createTilejson, addCustomLayer } from "./utils";

export default function CustomLayerMap({
  baseStyle,
  initialView,
  customLayer,
  onLoaded = () => {},
}) {
  const [map, setMap] = useState(null);

  // Function to add layer to map
  const addLayer = useCallback(() => {
    const layerDefinition = createTilejson(customLayer);
    addCustomLayer(map, layerDefinition);
  }, [customLayer, map]);

  // Call onLoaded once the map loads
  useEffect(() => {
    if (!map) return;
    onLoaded(map);
  }, [map, onLoaded]);

  // Set event handler to add custom tiles once map is defined
  useEffect(() => {
    if (!map) return;
    addLayer();
  }, [map, addLayer]);

  return (
    <DefaultMap
      baseStyle={baseStyle}
      initialView={initialView}
      onLoaded={setMap}
    />
  );
}
