import React, { useState, useReducer, useEffect, useCallback } from "react";
import DefaultMap from "./Map/DefaultMap";
import CustomMultiLayerMap from "./Map/CustomMultiLayerMap";
import SwipeMap from "./Map/SwipeMap";

// Constants for box sizing
const METERS_PER_PIXEL = 30.0;
const LAT_DEGREES_PER_PIXEL = METERS_PER_PIXEL / 111139.0;
const LNG_DEGREES_PER_PIXEL = (lat) =>
  METERS_PER_PIXEL / (-12.5086 * lat * lat - 173.5626 * lat + 112246);

// Maximum zoom for map component
const MAX_ZOOM = 12.9;

/**
 * Create the box based on coordinate and offset
 * @param {Object} coord - The coordinate at the center of the box
 * @param {Object} offset - Offsets for latitude and longitude
 * @returns {float[][][]}
 */
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

/**
 * Get an offset based on the size of the MIW and the
 * current latitude.  The longitude offset will change as
 * as function of latitude
 * @param {float} lat - The current latitude
 * @param {float[]} miwSize - The requested miwSize in pixels
 * @returns {Object}
 */
function getOffset(lat, miwSize) {
  // TODO: This is a total hack.  My calculations above are producing
  // a rectangle that is too big.  This is a scale reducer just to
  // shrink the visible size of the rectangle on the map.
  const scaleReducer = 0.7;
  return {
    lng: (miwSize[0] / 2.0) * LNG_DEGREES_PER_PIXEL(lat) * scaleReducer,
    lat: (miwSize[1] / 2.0) * LAT_DEGREES_PER_PIXEL * scaleReducer,
  };
}

/**
 * Create an initial GeoJSON object from coordinate and offset
 * @param {Object} coord - The coordinate at the center of the box
 * @param {Object} offset - Offsets for latitude and longitude
 * @returns {Object}
 */
function initializeGeojson(coord, offset) {
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
}

/**
 * Initialize state for this component
 * @param {Object} obj - Container object
 * @param {float} obj.initialLng - Initial longitude
 * @param {float} obj.initialLat - Initial latitude
 * @param {float[][]} obj.miwSize - Initial MIW size
 * @returns {Object}
 */
function initialize({ initialLng, initialLat, miwSize }) {
  const coord = { lng: initialLng, lat: initialLat };
  const offset = getOffset(coord.lat, miwSize);
  const geojson = initializeGeojson(coord, offset);
  return {
    coord: coord,
    offset: offset,
    geojson: geojson,
  };
}

/**
 * Reducer function for setting state
 * @param {Object} state - Current state
 * @param {Object} action - Current action to perform
 * @param {string} action.type - Name of the current action
 * @param {Object} action.payload - Current payload to set object
 * @returns {Object}
 */
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

export default function ResponseMap({
  tiles,
  regionGeojson,
  idx,
  miwSize,
  miwRecenter,
  initialLng,
  initialLat,
  initialZoom,
  onMouseMove,
  onMiwMove,
}) {
  // Reference to map
  const [map, setMap] = useState(null);

  // Set up reducer and initial state
  const [state, dispatch] = useReducer(
    reducer,
    { initialLng, initialLat, miwSize },
    initialize
  );

  function handleMovement(coord, point) {
    dispatch({
      type: "SET_COORD",
      payload: coord,
    });
    renderBox(coord);
    const features = map.queryRenderedFeatures(point, {
      layers: ["regions-layer"],
    });
    const region = features.length === 0 ? 0 : features[0].properties.Id;
    onMiwMove({ coord: coord, region: region });
  }

  useEffect(() => {
    if (miwRecenter) {
      const bounds = map.getBounds();
      const lat = (bounds._ne.lat + bounds._sw.lat) / 2.0;
      const lng = (bounds._ne.lng + bounds._sw.lng) / 2.0;
      const coord = { lng: lng, lat: lat };
      const point = map.project(coord);
      handleMovement(coord, point);
    }
  }, [miwRecenter]);

  // Render box based on current coordinate
  const renderBox = useCallback(
    (coord) => {
      if (!map || !map.getSource("box")) return;
      state.geojson.features[0].geometry.coordinates = makeBox(
        coord,
        state.offset
      );
      map.getSource("box").setData(state.geojson);
    },
    [map, state.offset, state.geojson]
  );

  // Set map handlers each time focus is on MIW
  const setMiwBoxHandlers = useCallback(() => {
    if (!map) return;
    const canvas = map.getCanvasContainer();

    // Grab and move the MIW
    function onMove(e) {
      canvas.style.cursor = "grabbing";
      handleMovement(e.lngLat, e.point);
    }

    // On mouse released, turn off onMove event
    function onUp(e) {
      canvas.style.cursor = "";
      map.off("mousemove", onMove);
    }

    // On mouse press, associate the two event handlers and
    // change cursor to grabbing icon
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
  }, [map, renderBox, onMiwMove]);

  // Set the map reference once the maps have loaded
  function handleMapLoad(compareMaps) {
    setMap(compareMaps.left);
  }

  // Change the box offsets if the MIW size changes
  useEffect(() => {
    dispatch({ type: "SET_OFFSET", payload: miwSize });
  }, [miwSize]);

  // Update the handlers to pick up changes to box size
  useEffect(() => {
    setMiwBoxHandlers();
  }, [state.offset, setMiwBoxHandlers]);

  // Rerender box
  useEffect(() => {
    renderBox(state.coord);
  }, [state.coord, state.offset, renderBox]);

  // Add event handler to report mouse location
  useEffect(() => {
    if (!map) return;
    map.on("mousemove", onMouseMove);
  }, [map, onMouseMove]);

  // Add source/layers for box once map loads
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
        "fill-opacity": 0,
      },
    });

    map.addLayer({
      id: "outline",
      type: "line",
      source: "box",
      layout: {},
      paint: {
        "line-color": "#ffff00",
        "line-width": 3,
      },
    });

    map.on("mouseenter", "box", () => {
      map.setPaintProperty("box", "fill-color", "#3bb2d0");
      map.setPaintProperty("outline", "line-color", "#ff6600");
      canvas.style.cursor = "move";
    });

    map.on("mouseleave", "box", () => {
      map.setPaintProperty("box", "fill-color", "#0080ff");
      map.setPaintProperty("outline", "line-color", "#ffff00");
      canvas.style.cursor = "";
    });
  }, [map, state.geojson]);

  useEffect(() => {
    if (!map) return;
    map.addSource("regions", {
      type: "geojson",
      data: regionGeojson,
    });

    map.addLayer({
      id: "regions-layer",
      type: "fill",
      source: "regions",
      paint: {
        "fill-color": "#0080ff",
        "fill-opacity": 0,
      },
    });

    map.addLayer({
      id: "regions-line",
      type: "line",
      source: "regions",
      layout: {
        "line-cap": "round",
      },
      paint: {
        "line-color": "#ffffff",
        "line-opacity": 0.4,
      },
    });
  }, [map]);

  return (
    <SwipeMap
      left={
        <CustomMultiLayerMap
          baseStyle="mapbox://styles/mapbox/dark-v10"
          initialView={{
            lng: initialLng,
            lat: initialLat,
            zoom: initialZoom,
            maxZoom: MAX_ZOOM,
          }}
          customLayers={tiles}
          layerIdx={idx}
        />
      }
      right={
        <DefaultMap
          baseStyle="mapbox://styles/mapbox/satellite-streets-v11"
          initialView={{
            lng: initialLng,
            lat: initialLat,
            zoom: initialZoom,
            maxZoom: MAX_ZOOM,
          }}
        />
      }
      onLoaded={handleMapLoad}
    />
  );
}
