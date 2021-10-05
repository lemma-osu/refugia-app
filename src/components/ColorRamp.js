import React from "react";
import { Svg } from "./Chart";

export default function ColorRamp({ specification, width, height }) {
  const margin = { left: 0, right: 0, top: 0, bottom: 0 };
  const textHeight = 15;
  const barOffset = textHeight + 10;
  const labelOffset = barOffset + height + 20;
  const totalHeight = labelOffset + 15;
  return (
    <Svg width={width} height={totalHeight} margin={margin}>
      <defs>
        <linearGradient id="grad" x1="0%" x2="100%" y1="0%" y2="0%">
          {specification.map((stop, idx) => (
            <stop
              key={idx}
              offset={`${stop.offset}%`}
              style={{ stopColor: `${stop.color}`, stopOpacity: 0.9 }}
            ></stop>
          ))}
        </linearGradient>
      </defs>
      <text fill="white" transform={`translate(0, ${textHeight})`}>
        Probability
      </text>
      <rect
        x="0"
        y={barOffset}
        width={width}
        height={height}
        fill="url(#grad)"
      ></rect>
      <g>
        <text
          fill="white"
          textAnchor="start"
          transform={`translate(0, ${labelOffset})`}
        >
          0.0
        </text>
        <text
          fill="white"
          textAnchor="middle"
          transform={`translate(${width / 2}, ${labelOffset})`}
        >
          0.5
        </text>
        <text
          fill="white"
          textAnchor="end"
          transform={`translate(${width}, ${labelOffset})`}
        >
          1.0
        </text>
      </g>
    </Svg>
  );
}
