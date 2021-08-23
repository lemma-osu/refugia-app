import React, { useState, useEffect, useCallback } from "react";
import DefaultMap from "./DefaultMap";
import { create_tilejson, add_custom_layer, remove_layer } from "./utils";

export default function CustomMultiLayerMap({
  base_style,
  initial_view,
  custom_layers,
  layer_idx = 0,
  on_loaded = () => {},
}) {
  const [map, set_map] = useState(null);
  const [layers, set_layers] = useState(null);
  const [layer_state, set_layer_state] = useState({ new: null, old: null });

  function switch_custom_layer(map, new_layer, old_layer) {
    // Pop the old layer off if it is currently in the map layer stack
    if (old_layer) {
      remove_layer(map, old_layer);
    }
    add_custom_layer(map, new_layer);
  }

  // Read in tilejson for all custom layers
  const set_custom_layers = useCallback(() => {
    set_layers(
      custom_layers.map((custom_layer) => {
        return create_tilejson(custom_layer);
      })
    );
  }, [custom_layers]);

  // Call on_loaded once the map loads
  useEffect(() => {
    if (!map) return;
    on_loaded(map);
  }, [map, on_loaded]);

  // Set event handler to add custom tiles once map is defined
  useEffect(() => {
    if (!map) return;
    set_custom_layers();
  }, [map, set_custom_layers]);

  // Update layer state after layers have been loaded
  useEffect(() => {
    if (!layers) return;
    set_layer_state((layer_state) => ({
      new: layer_idx,
      old: layer_state.new,
    }));
  }, [layers, layer_idx]);

  useEffect(() => {
    if (!layers || layer_state.new === null) return;
    switch_custom_layer(map, layers[layer_state.new], layers[layer_state.old]);
  }, [map, layers, layer_state]);

  return (
    <DefaultMap
      base_style={base_style}
      initial_view={initial_view}
      on_loaded={set_map}
    />
  );
}
