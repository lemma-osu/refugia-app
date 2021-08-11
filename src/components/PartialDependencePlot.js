import React, { useState, useEffect, useMemo } from "react";
import {
  autoType,
  bisectLeft,
  csv,
  extent,
  map as d3map,
  scaleLinear,
} from "d3";

import { Svg, XAxis, YAxis, Line, Dot } from "./Chart";

const x_value = (d) => d.X;
const y_value = (d) => d.Y;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const move_dot_factory = (data, x_scale, y_scale) => {
  return (variable_value) => {
    // Find the X value that corresponds to the variable value
    // and return the (X,Y) pair at that location
    const idx = clamp(
      bisectLeft(d3map(data, x_value), variable_value),
      0,
      data.length - 1
    );
    var pt = new DOMPoint(
      x_scale(x_value(data[idx])),
      y_scale(y_value(data[idx]))
    );
    return pt;
  };
};

const PartialDependencePlot = ({ chart_data_path, variable_value }) => {
  const [data, set_data] = useState([{ X: 0, Y: 0 }]);
  const [dot, set_dot] = useState([0, 0]);

  const width = 223;
  const height = 148;
  const margin = { top: 5, right: 5, bottom: 20, left: 20 };

  const inner_width = width - margin.left - margin.right;
  const inner_height = height - margin.top - margin.bottom;

  const x_scale = useMemo(
    () =>
      scaleLinear()
        .domain(extent(data, x_value))
        .range([0, inner_width])
        .nice(),
    [data, inner_width]
  );

  const y_scale = useMemo(
    () =>
      scaleLinear()
        .domain(extent(data, y_value))
        .range([0, inner_height])
        .nice(),
    [data, inner_height]
  );

  const num_ticks = 5;

  const move_dot = useMemo(() => {
    return move_dot_factory(data, x_scale, y_scale);
  }, [data, x_scale, y_scale]);

  useEffect(() => {
    async function get_data() {
      set_data(await csv(chart_data_path, autoType));
    }
    get_data();
  }, [chart_data_path]);

  useEffect(() => {
    if (!variable_value) return;
    set_dot(move_dot(variable_value));
  }, [variable_value, move_dot]);

  return (
    <Svg width={width} height={height} margin={margin}>
      <XAxis
        x_scale={x_scale}
        inner_height={inner_height}
        num_ticks={num_ticks}
        tick_offset={7}
      />
      <YAxis
        y_scale={y_scale}
        inner_width={inner_width}
        num_ticks={num_ticks}
        tick_offset={7}
      />
      <Line
        data={data}
        x_scale={x_scale}
        y_scale={y_scale}
        x_value={x_value}
        y_value={y_value}
      />
      <Dot
        d={dot}
        x_scale={x_scale}
        y_scale={y_scale}
        x_value={x_value}
        y_value={y_value}
        circle_radius={5}
      />
    </Svg>
  );
};

export default PartialDependencePlot;
