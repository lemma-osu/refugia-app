import React, { useState, useReducer, useEffect } from "react";
import DefaultMap from "./Map/DefaultMap";
import CustomMultiLayerMap from "./Map/CustomMultiLayerMap";
import SwipeMap from "./Map/SwipeMap";

const METERS_PER_PIXEL = 30.0;
const LAT_DEGREES_PER_PIXEL = METERS_PER_PIXEL / 111139.0;
const LNG_DEGREES_PER_PIXEL = (lat) =>
  METERS_PER_PIXEL / (-12.5086 * lat * lat - 173.5626 * lat + 112246);

function makeBox(coord, offset) {
  return [
    [
      [coord.lng - offset.lng, coord.lat - offset.lat],
      [coord.lng + offset.lng, coord.lat - offset.lat],
      [coord.lng + offset.lng, coord.lat + offset.lat],
      [coord.lng - offset.lng, coord.lat + offset.lat],
      [coord.lng - offset.lng, coord.lat - offset.lat],
    ],
  ];
}

const getOffset = (lat, miwSize) => {
  return {
    lng: miwSize[0] * LNG_DEGREES_PER_PIXEL(lat),
    lat: miwSize[1] * LAT_DEGREES_PER_PIXEL,
  };
};

const initializeGeojson = (coord, offset) => {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: makeBox(coord, offset),
        },
      },
    ],
  };
};

function initialize({ config, miwSize }) {
  const coord = { lng: config.initial_lng, lat: config.initial_lat };
  const offset = getOffset(coord.lat, miwSize);
  const geojson = initializeGeojson(coord, offset);
  return {
    coord: coord,
    offset: offset,
    geojson: geojson,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_COORD":
      return {
        ...state,
        coord: action.payload,
      };

    case "SET_OFFSET":
      return {
        ...state,
        offset: getOffset(state.coord.lat, action.payload),
      };

    default:
      return state;
  }
}

export default function ResponseMap({ config, idx, miwSize, onClickedCoord }) {
  const [map, setMap] = useState(null);
  const [state, dispatch] = useReducer(
    reducer,
    { config, miwSize },
    initialize
  );
  const maxZoom = 12.9;

  function renderBox(coord) {
    if (!map || !map.getSource("box")) return;
    state.geojson.features[0].geometry.coordinates = makeBox(
      coord,
      state.offset
    );
    map.getSource("box").setData(state.geojson);
  }

  function setMapHandlers() {
    if (!map) return;
    const canvas = map.getCanvasContainer();

    function onMove(e) {
      const coord = e.lngLat;
      canvas.style.cursor = "grabbing";
      dispatch({
        type: "SET_COORD",
        payload: coord,
      });
      renderBox(coord);
    }

    function onUp(e) {
      canvas.style.cursor = "";
      map.off("mousemove", onMove);
    }

    function onDown(e) {
      e.preventDefault();
      canvas.style.cursor = "grab";
      map.on("mousemove", onMove);
      map.once("mouseup", onUp);
    }

    // Deregister handlers if existing
    map.off("mousemove", onMove);
    map.off("mouseup", onUp);
    map.off("mousedown", "box", onDown);

    // Register the mousedown on box
    map.on("mousedown", "box", onDown);
  }

  function handleMapLoad(compareMaps) {
    setMap(compareMaps.left);
  }

  useEffect(() => {
    dispatch({ type: "SET_OFFSET", payload: miwSize });
  }, [miwSize]);

  useEffect(() => {
    renderBox(state.coord);
    setMapHandlers();
  }, [state.offset]);

  // useEffect(() => {
  //   if (!map) return;

  //   function handleCursor() {
  //     map.getCanvas().style.cursor =
  //       map.getZoom() >= zoomCursorSwitch ? "crosshair" : "grab";
  //   }

  //   function handleDblClick(event) {
  //     if (map.getZoom() >= zoomCursorSwitch) {
  //       event.preventDefault();
  //       map.getCanvas().style.cursor = "wait";
  //       onClickedCoord(event.lngLat);
  //     }
  //   }

  //   map.on("zoomend", handleCursor);
  //   map.on("dblclick", handleDblClick);
  // }, [map, onClickedCoord]);

  useEffect(() => {
    if (!map) return;

    const canvas = map.getCanvasContainer();

    map.addSource("box", {
      type: "geojson",
      data: state.geojson,
    });

    map.addLayer({
      id: "box",
      type: "fill",
      source: "box",
      layout: {},
      paint: {
        "fill-color": "#0080ff",
        "fill-opacity": 0.5,
      },
    });

    map.addLayer({
      id: "outline",
      type: "line",
      source: "box",
      layout: {},
      paint: {
        "line-color": "#000",
        "line-width": 3,
      },
    });

    map.on("mouseenter", "box", () => {
      map.setPaintProperty("box", "fill-color", "#3bb2d0");
      canvas.style.cursor = "move";
    });

    map.on("mouseleave", "box", () => {
      map.setPaintProperty("box", "fill-color", "#0080ff");
      canvas.style.cursor = "";
    });

    setMapHandlers();
  }, [map]);

  return (
    <SwipeMap
      left={
        <CustomMultiLayerMap
          baseStyle="mapbox://styles/mapbox/dark-v10"
          initialView={{
            lng: config.initial_lng,
            lat: config.initial_lat,
            zoom: config.initial_zoom,
            maxZoom: maxZoom,
          }}
          customLayers={config.tiles}
          layerIdx={idx}
        />
      }
      right={
        <DefaultMap
          baseStyle="mapbox://styles/mapbox/satellite-streets-v11"
          initialView={{
            lng: config.initial_lng,
            lat: config.initial_lat,
            zoom: config.initial_zoom,
            maxZoom: maxZoom,
          }}
        />
      }
      onLoaded={handleMapLoad}
    />
  );
}
