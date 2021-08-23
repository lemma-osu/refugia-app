import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import Compare from "!mapbox-gl-compare"; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useRef, useState, useEffect } from "react";

export default function SwipeMap({ left, right }) {
  const container = useRef(null);
  const [compare, set_compare] = useState(null);
  const [left_map, set_left_map] = useState(null);
  const [right_map, set_right_map] = useState(null);

  function add_loaded_callback(el, cb) {
    return React.cloneElement(el, { on_loaded: cb });
  }

  useEffect(() => {
    if (!left_map || !right_map || compare) return;
    set_compare(new Compare(left_map, right_map, container.current, {}));
  }, [left_map, right_map, compare]);

  return (
    <div ref={container}>
      {add_loaded_callback(left, set_left_map)}
      {add_loaded_callback(right, set_right_map)}
    </div>
  );
}
