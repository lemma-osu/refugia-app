const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  bounds: [[-125.0, 37.0], [-120.0, 49.5]]
});
let current_layer;

function change_map(map, layer_definition, current_layer) {
  // Pop the current layer off
  if (current_layer !== undefined) {
    map.removeLayer(current_layer);
  }

  // Add the new source if necessary
  var key = layer_definition.layer.source;
  if (map.getSource(key) === undefined || !map.isSourceLoaded(key)) {
    map.addSource(key, layer_definition.source);
  }

  // Add the new layer
  var before_layer = map.getLayer("forest-mask-layer") === undefined
    ? "land-structure-polygon"
    : "forest-mask-layer";
  map.addLayer(layer_definition.layer, before_layer);
  return layer_definition.layer.id;
}

function initialize() {
  create_source_objects(function () {
    current_layer = change_map(map, map_layers["ogsi-80"], current_layer);
  });
}

map.on("load", initialize);
