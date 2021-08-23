export function create_tilejson(layer) {
  return {
    source: {
      type: "raster",
      scheme: "xyz",
      tiles: layer.tile_urls,
      tileSize: 256,
    },
    layer: {
      id: layer.name.concat("-", "layer"),
      type: "raster",
      source: layer.name,
      minzoom: 5,
      maxzoom: 13,
    },
  };
}

export function add_custom_layer(map, layer_definition) {
  // Add the new source if necessary
  const source = layer_definition.layer.source;
  if (map.getSource(source) === undefined || !map.isSourceLoaded(source)) {
    map.addSource(source, layer_definition.source);
  }

  // Add the new layer
  const before_layer =
    map.getLayer("forest-mask-layer") === undefined
      ? "land-structure-polygon"
      : "forest-mask-layer";
  map.addLayer(layer_definition.layer, before_layer);
}

export function remove_layer(map, layer) {
  map.removeLayer(layer.layer.id);
}
