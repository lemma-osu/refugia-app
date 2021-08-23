import React, { useState, useEffect } from "react";
import CustomLayerMap from "./Map/CustomLayerMap";

export default function ResponseMap({ config, on_clicked_coord }) {
  const [map, set_map] = useState(null);
  const [lng, set_lng] = useState(parseFloat(config.initial_lng));
  const [lat, set_lat] = useState(parseFloat(config.initial_lat));
  const [zoom, set_zoom] = useState(parseFloat(config.initial_zoom));

  const zoom_cursor_switch = 11.0;
  // const zoom_limit = 12.3;

  useEffect(() => {
    function handle_cursor() {
      map.getCanvas().style.cursor =
        map.getZoom() >= zoom_cursor_switch ? "crosshair" : "grab";
    }

    function handle_move_end() {
      set_lng(map.getCenter().lng.toFixed(4));
      set_lat(map.getCenter().lat.toFixed(4));
      set_zoom(map.getZoom().toFixed(2));
    }

    function handle_dbl_click(event) {
      if (map.getZoom() >= zoom_cursor_switch) {
        event.preventDefault();
        map.getCanvas().style.cursor = "wait";
        on_clicked_coord(event.lngLat);
      }
    }

    if (!map) return;
    map.on("zoomend", handle_cursor);
    map.on("moveend", handle_move_end);
    map.on("dblclick", handle_dbl_click);
  }, [map, on_clicked_coord]);

  return (
    <CustomLayerMap
      base_style="mapbox://styles/mapbox/dark-v10"
      initial_view={{
        lng: config.initial_lng,
        lat: config.initial_lat,
        zoom: config.initial_zoom,
      }}
      custom_layer={config.tiles[0]}
      on_loaded={set_map}
    />
  );
}
