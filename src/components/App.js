import React, { useState, useEffect, useRef, useCallback } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

import { access_token } from "../tokens";
import { create_source_objects } from "../generate-map-spec";

import DemoPanel from "./DemoPanel";

import config from "../config.json";

mapboxgl.accessToken = access_token;

const App = () => {
  const map = useRef(null);
  const map_container = useRef(null);

  const [lng, set_lng] = useState(-122.8);
  const [lat, set_lat] = useState(44.0);
  const [zoom, set_zoom] = useState(11.2);
  const [current_layer, set_current_layer] = useState();
  const [clicked_coord, set_clicked_coord] = useState(null);

  const zoom_cursor_switch = 11.0;
  const zoom_limit = 12.3;

  const handle_cursor = () => {
    map.current.getCanvas().style.cursor =
      map.current.getZoom() >= zoom_cursor_switch ? "crosshair" : "grab";
  };

  const handle_move_end = () => {
    set_lng(map.current.getCenter().lng.toFixed(4));
    set_lat(map.current.getCenter().lat.toFixed(4));
    set_zoom(map.current.getZoom().toFixed(2));
  };

  const handle_dbl_click = (event) => {
    if (map.current.getZoom() >= zoom_cursor_switch) {
      event.preventDefault();
      map.current.getCanvas().style.cursor = "wait";
      set_clicked_coord(event.lngLat);
    }
  };

  const handle_modal_close = useCallback(() => {
    set_clicked_coord(null);
    handle_cursor();
  }, []);

  const change_map = (layer_definition) => {
    // Pop the current layer off
    if (current_layer !== undefined) {
      map.current.removeLayer(current_layer);
    }

    // Add the new source if necessary
    var key = layer_definition.layer.source;
    if (
      map.current.getSource(key) === undefined ||
      !map.current.isSourceLoaded(key)
    ) {
      map.current.addSource(key, layer_definition.source);
    }

    // Add the new layer
    var before_layer =
      map.current.getLayer("forest-mask-layer") === undefined
        ? "land-structure-polygon"
        : "forest-mask-layer";
    map.current.addLayer(layer_definition.layer, before_layer);
    return layer_definition.layer.id;
  };

  async function initialize() {
    const map_layers = await create_source_objects(config);
    set_current_layer(change_map(map_layers["ogsi-80"]));
  }

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: map_container.current,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [lng, lat],
      zoom: zoom,
      maxZoom: zoom_limit,
    });
    map.current.on("load", initialize);
    map.current.on("moveend", handle_move_end);
    map.current.on("zoomend", handle_cursor);
    map.current.on("dblclick", handle_dbl_click);
  });

  return (
    <>
      <div ref={map_container} className="map"></div>
      <div
        className="card text-white bg-dark m-3"
        style={{ maxWidth: "20rem", height: "calc(100vh - 32px)" }}
      >
        <div className="card-body">
          <h5 className="card-title">Fire Refugia Demonstration</h5>
          <p className="card-text">
            This application is pretty much the coolest application in the
            entire world even though it basically does nothing at present. This
            card gives information about the map to the right and provides the
            instructions to the user on how to create the modal for a particular
            study area.
          </p>
          <p className="card-text">
            To enable the modal demonstration, zoom in to an extent where the
            cursor changes to a crosshair and double click the button. This will
            load the modal window and show the demonstration.
          </p>
          <p className="card-text">
            Longitude: {lng}
            <br />
            Latitude: {lat}
            <br />
            Zoom: {zoom}
          </p>
        </div>
      </div>
      <DemoPanel
        config={config}
        clicked_coord={clicked_coord}
        onHideModal={handle_modal_close}
      />
    </>
  );
};

export default App;
