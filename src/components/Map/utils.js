export function createTilejson(layer) {
  return {
    source: {
      type: "raster",
      // scheme: "xyz",
      scheme: "tms",
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

export function addCustomLayer(map, layerDefinition) {
  // Add the new source if necessary
  const source = layerDefinition.layer.source;
  if (map.getSource(source) === undefined || !map.isSourceLoaded(source)) {
    map.addSource(source, layerDefinition.source);
  }

  // Add the new layer
  const beforeLayer =
    map.getLayer("forest-mask-layer") === undefined
      ? "land-structure-polygon"
      : "forest-mask-layer";
  map.addLayer(layerDefinition.layer, beforeLayer);
}

export function removeLayer(map, layer) {
  map.removeLayer(layer.layer.id);
}
