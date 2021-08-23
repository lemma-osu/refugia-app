import React, { useState, useEffect, useCallback } from "react";
import DefaultMap from "./DefaultMap";
import { create_tilejson, add_custom_layer } from "./utils";

export default function CustomLayerMap({
  base_style,
  custom_layer,
  on_loaded = () => {},
}) {
  const [map, set_map] = useState(null);

  // Function to add layer to map
  const add_layer = useCallback(() => {
    const layer_definition = create_tilejson(custom_layer);
    add_custom_layer(map, layer_definition);
  }, [custom_layer, map]);

  // Call on_loaded once the map loads
  useEffect(() => {
    if (!map) return;
    on_loaded(map);
  }, [map, on_loaded]);

  // Set event handler to add custom tiles once map is defined
  useEffect(() => {
    if (!map) return;
    add_layer();
  }, [map, add_layer]);

  return <DefaultMap base_style={base_style} on_loaded={set_map} />;
}
