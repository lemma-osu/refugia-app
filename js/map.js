const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  // bounds: [[-125.0, 37.0], [-120.0, 49.5]]
  bounds: [[-123.0, 43.5], [-122.85, 43.65]]
});

// WGS-84 (EPSG: 4326)
const from_proj = 'GEOGCS["WGS 84",'
  + 'DATUM["WGS_1984",'
  + 'SPHEROID["WGS 84",6378137,298.257223563,'
  + 'AUTHORITY["EPSG","7030"]],'
  + 'AUTHORITY["EPSG","6326"]],'
  + 'PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],'
  + 'UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],'
  + 'AUTHORITY["EPSG","4326"]]';

// USGS National Albers (EPSG: 5070)
const to_proj = 'PROJCS["NAD83 / Conus Albers",'
  + 'GEOGCS["NAD83", DATUM["North_American_Datum_1983",'
  + 'SPHEROID["GRS 1980",6378137,298.257222101,'
  + 'AUTHORITY["EPSG","7019"]],'
  + 'TOWGS84[0,0,0,0,0,0,0],'
  + 'AUTHORITY["EPSG","6269"]],'
  + 'PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],'
  + 'UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],'
  + 'AUTHORITY["EPSG","4269"]],'
  + 'PROJECTION["Albers_Conic_Equal_Area"],'
  + 'PARAMETER["standard_parallel_1",29.5],'
  + 'PARAMETER["standard_parallel_2",45.5],'
  + 'PARAMETER["latitude_of_center",23],'
  + 'PARAMETER["longitude_of_center",-96],'
  + 'PARAMETER["false_easting",0],'
  + 'PARAMETER["false_northing",0],'
  + 'UNIT["metre",1,AUTHORITY["EPSG","9001"]],'
  + 'AXIS["X",EAST],'
  + 'AXIS["Y",NORTH],'
  + 'AUTHORITY["EPSG","5070"]]';

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

function project_point(lng, lat) {
  return proj4(from_proj, to_proj, [lng, lat]);
}

function display_modal(event) {
  const xy = project_point(event.lngLat.lng, event.lngLat.lat);
  const coord_div = modal_div.querySelector("#coord");
  coord_div.textContent = `Coordinate: (${xy[0].toFixed(3)}, ${xy[1].toFixed(3)})`;
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
