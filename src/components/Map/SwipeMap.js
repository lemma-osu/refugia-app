import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import Compare from "!mapbox-gl-compare"; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useRef, useState, useEffect } from "react";

export default function SwipeMap({ left, right, onLoaded }) {
  const container = useRef(null);
  const [compare, setCompare] = useState(null);
  const [leftMap, setLeftMap] = useState(null);
  const [rightMap, setRightMap] = useState(null);

  function addLoadedCallback(el, cb) {
    return React.cloneElement(el, { onLoaded: cb });
  }

  useEffect(() => {
    if (!leftMap || !rightMap || compare) return;
    setCompare(new Compare(leftMap, rightMap, container.current, {}));
  }, [leftMap, rightMap, compare]);

  // Call onLoaded once the compare loads and return both the
  // left and right maps
  useEffect(() => {
    if (!compare) return;
    onLoaded({ left: leftMap, right: rightMap });
  }, [compare, leftMap, rightMap, onLoaded]);

  return (
    <div ref={container}>
      {addLoadedCallback(left, setLeftMap)}
      {addLoadedCallback(right, setRightMap)}
    </div>
  );
}
