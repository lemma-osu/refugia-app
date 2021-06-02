const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  // bounds: [[-125.0, 37.0], [-120.0, 49.5]]
  bounds: [[-123.0, 43.5], [-122.85, 43.65]]
});
const modal_div = document.querySelector("#example-modal");
const modal = new bootstrap.Modal(modal_div);
const zoom_limit = 11.5;
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

function display_modal(event) {
  const coord_div = modal_div.querySelector("#coord");
  coord_div.textContent = `Coordinate: (${event.lngLat.lat.toFixed(3)}, ${event.lngLat.lng.toFixed(3)})`;
  modal.show();
}

map.on("dblclick", function(event) {
  if (map.getZoom() >= zoom_limit) {
    event.preventDefault();
    display_modal(event);
  }
})

function handle_cursor() {
  map.getCanvas().style.cursor = map.getZoom() >= zoom_limit
    ? "crosshair"
    : "grab";
}

map.on("zoom", function() {
  handle_cursor();
});

function initialize() {
  create_source_objects(function () {
    current_layer = change_map(map, map_layers["ogsi-80"], current_layer);
    handle_cursor();
  });
}

map.on("load", initialize);
