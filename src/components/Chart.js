import React, { useRef, useEffect } from "react";
import { line } from "d3";

export const Svg = ({ width, height, margin, children }) => {
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>{children}</g>
    </svg>
  );
};

export const XAxis = ({
  x_scale,
  inner_height,
  num_ticks = 5,
  tick_offset = 3,
}) => {
  return x_scale.ticks(num_ticks).map((tick_value) => (
    <g
      className="tick"
      key={tick_value}
      transform={`translate(${x_scale(tick_value)}, 0)`}
    >
      <line y2={inner_height} stroke="black" />
      <text
        style={{ textAnchor: "middle" }}
        dy=".71em"
        y={inner_height + tick_offset}
      >
        {tick_value}
      </text>
    </g>
  ));
};

export const YAxis = ({
  y_scale,
  inner_width,
  num_ticks = 5,
  tick_offset = 3,
}) => {
  return y_scale.ticks(num_ticks).map((tick_value) => (
    <g
      className="tick"
      key={tick_value}
      transform={`translate(0, ${y_scale(tick_value)})`}
    >
      <line x2={inner_width} stroke="black" />
      <text style={{ textAnchor: "end" }} dy=".32em" x={-tick_offset}>
        {tick_value}
      </text>
    </g>
  ));
};

export const Line = ({
  data,
  x_scale,
  y_scale,
  x_value,
  y_value,
  set_node,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    set_node(ref.current);
  });

  const line_ = line()
    .x((d) => x_scale(x_value(d)))
    .y((d) => y_scale(y_value(d)));

  const d = line_(data);
  return <path ref={ref} className="line" d={d} />;
};

export const Dot = ({ d, circle_radius }) => (
  <circle className="dot" cx={d.x} cy={d.y} r={circle_radius} />
);
