import React, { useState, useEffect } from "react";
import { extent, scaleLinear, interpolate, csv } from "d3";

import { Svg, XAxis, YAxis, Line, Dot } from "./Chart";

const move_dot = (node, variable_value) => {
  const length = node.getTotalLength() || 0;
  const r = interpolate(0, length);
  return node.getPointAtLength(r(variable_value));
};

const PartialDependencePlot = ({ chart_data_path, variable_value }) => {
  const [data, set_data] = useState([{ X: 0, Y: 0 }]);
  const [node, set_node] = useState(null);
  const [dot, set_dot] = useState([0, 0]);

  useEffect(() => {
    async function get_data() {
      set_data(await csv(chart_data_path));
    }
    get_data();
  }, [chart_data_path]);

  useEffect(() => {
    if (!node || !variable_value) return;
    set_dot(move_dot(node, variable_value));
  }, [node, variable_value]);

  // const width = 300;
  // const height = 300;
  // const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  const width = 223;
  const height = 148;
  const margin = { top: 5, right: 5, bottom: 20, left: 20 };

  const inner_width = width - margin.left - margin.right;
  const inner_height = height - margin.top - margin.bottom;

  const x_value = (d) => +d.X;
  const y_value = (d) => +d.Y;

  const x_scale = scaleLinear()
    .domain(extent(data, x_value))
    .range([0, inner_width])
    .nice();

  const y_scale = scaleLinear()
    .domain(extent(data, y_value))
    .range([0, inner_height])
    .nice();

  const num_ticks = 5;

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
        set_node={set_node}
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
