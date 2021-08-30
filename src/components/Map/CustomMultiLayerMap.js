import React, { useState, useEffect, useCallback } from "react";
import DefaultMap from "./DefaultMap";
import { createTilejson, addCustomLayer, removeLayer } from "./utils";

export default function CustomMultiLayerMap({
  baseStyle,
  initialView,
  customLayers,
  layerIdx = 0,
  onLoaded,
}) {
  const [map, setMap] = useState(null);
  const [layers, setLayers] = useState(null);
  const [layerState, setLayerState] = useState({ new: null, old: null });

  function switchCustomLayer(map, newLayer, oldLayer) {
    // Pop the old layer off if it is currently in the map layer stack
    if (oldLayer) {
      removeLayer(map, oldLayer);
    }
    addCustomLayer(map, newLayer);
  }

  // Read in tilejson for all custom layers
  const setCustomLayers = useCallback(() => {
    setLayers(
      customLayers.map((customLayer) => {
        return createTilejson(customLayer);
      })
    );
  }, [customLayers]);

  // Call onLoaded once the map loads
  useEffect(() => {
    if (!map) return;
    onLoaded(map);
  }, [map, onLoaded]);

  // Set event handler to add custom tiles once map is defined
  useEffect(() => {
    if (!map) return;
    setCustomLayers();
  }, [map, setCustomLayers]);

  // Update layer state after layers have been loaded
  useEffect(() => {
    if (!layers) return;
    setLayerState((layerState) => ({
      new: layerIdx,
      old: layerState.new,
    }));
  }, [layers, layerIdx]);

  useEffect(() => {
    if (!layers || layerState.new === null) return;
    switchCustomLayer(map, layers[layerState.new], layers[layerState.old]);
  }, [map, layers, layerState]);

  return (
    <DefaultMap
      baseStyle={baseStyle}
      initialView={initialView}
      onLoaded={setMap}
    />
  );
}
