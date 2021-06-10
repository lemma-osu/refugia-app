import config from "../config.json";

export async function create_source_objects() {
  let map_layers = [];
  const TILE_URL =
    "http://localhost:8000/tiles/{name}/{z}/{x}/{y}.png";
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
  return map_layers;
}
