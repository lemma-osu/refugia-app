export async function create_source_objects(config) {
  let map_layers = [];
  config.tiles.forEach((layer) => {
    map_layers[layer.name] = {
      legend: layer.legend,
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
  });
  return map_layers;
}
