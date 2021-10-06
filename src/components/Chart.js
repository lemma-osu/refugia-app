import React from "react";
import { line, max, format } from "d3";

export function Svg({ width, height, margin, className, children }) {
  return (
    <svg width={width} height={height} className={className}>
      <g transform={`translate(${margin.left},${margin.top})`}>{children}</g>
    </svg>
  );
}

export function XAxis({ xScale, innerHeight, numTicks = 5, tickOffset = 3 }) {
  const maxValue = max(xScale.ticks(numTicks));
  const formatter = maxValue > 10000 ? format(".2s") : format("");
  return xScale.ticks(numTicks).map((tickValue) => (
    <g
      className="tick"
      key={tickValue}
      transform={`translate(${xScale(tickValue)}, 0)`}
    >
      <line y2={innerHeight} stroke="black" />
      <text
        style={{ textAnchor: "middle" }}
        dy=".71em"
        y={innerHeight + tickOffset}
      >
        {formatter(tickValue)}
      </text>
    </g>
  ));
}

export function YAxis({ yScale, innerWidth, numTicks = 5, tickOffset = 3 }) {
  return yScale.ticks(numTicks).map((tickValue) => (
    <g
      className="tick"
      key={tickValue}
      transform={`translate(0, ${yScale(tickValue)})`}
    >
      <line x2={innerWidth} stroke="black" />
      <text style={{ textAnchor: "end" }} dy=".32em" x={-tickOffset}>
        {tickValue}
      </text>
    </g>
  ));
}

export function Line({ data, xScale, yScale, xValue, yValue }) {
  const line_ = line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)));

  const d = line_(data);
  return <path className="line" d={d} />;
}

export function Dot({ d, circleRadius }) {
  return <circle className="dot" cx={d.x} cy={d.y} r={circleRadius} />;
}
