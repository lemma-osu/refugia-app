let map_layers = [];

function create_source_objects(cb) {
  const TILE_URL =
    "http://localhost:8000/tiles/{name}/{z}/{x}/{y}.png";
  const json_fn = "./config.json";
  fetch(json_fn)
  .then(function(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  })
  .then(function(config) {
    config.forEach(layer => {
      const tiles = TILE_URL.replace("{name}", layer.name);
      map_layers[layer.name] = {
        legend: layer.legend,
        source: {
          type: "raster",
          scheme: "xyz",
          tiles: [tiles],
          tileSize: 256,
        },
        layer: {
          id: layer.name.concat("-", "layer"),
          type: "raster",
          source: layer.name,
          minzoom: 5,
          maxzoom: 13,
        }
      };
    });
    cb();
  })
  .catch(function() {
    console.log("There was an issue with the configuration");
  });  
}
