export async function create_source_objects(config) {
  let mapLayers = [];
  config.tiles.forEach((layer) => {
    mapLayers[layer.name] = {
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
  return mapLayers;
}
