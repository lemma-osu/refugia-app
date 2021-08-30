import React from "react";
import { Svg } from "./Chart";

export default function ColorRamp() {
  const margin = { left: 0, right: 0, top: 0, bottom: 0 };
  const width = 286;
  return (
    <Svg width={width} height={100} margin={margin}>
      <defs>
        <linearGradient id="grad" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop
            offset="0%"
            style={{ stopColor: `rgb(140, 81, 10)`, stopOpacity: 0.9 }}
          ></stop>
          <stop
            offset="23.9%"
            style={{ stopColor: `rgb(140, 81, 10)`, stopOpacity: 0.9 }}
          ></stop>
          <stop
            offset="30.1%"
            style={{ stopColor: `rgb(216, 179, 101)`, stopOpacity: 0.9 }}
          ></stop>
          <stop
            offset="35.8%"
            style={{ stopColor: `rgb(246, 232, 195)`, stopOpacity: 0.9 }}
          ></stop>
          <stop
            offset="41.7%"
            style={{ stopColor: `rgb(199, 234, 229)`, stopOpacity: 0.9 }}
          ></stop>
          <stop
            offset="50.1%"
            style={{ stopColor: `rgb(90, 180, 172)`, stopOpacity: 0.9 }}
          ></stop>
          <stop
            offset="67.9%"
            style={{ stopColor: `rgb(1, 102, 94)`, stopOpacity: 0.9 }}
          ></stop>
          <stop
            offset="100%"
            style={{ stopColor: `rgb(1, 102, 94)`, stopOpacity: 0.9 }}
          ></stop>
        </linearGradient>
      </defs>
      <text fill="white" transform="translate(0,15)">
        Refugial Probability
      </text>
      <rect x="0" y="25" width={width} height="30" fill="url(#grad)"></rect>
      <g>
        <text fill="white" textAnchor="start" transform={`translate(0,75)`}>
          0.0
        </text>
        <text
          fill="white"
          textAnchor="middle"
          transform={`translate(${width / 2}, 75)`}
        >
          0.5
        </text>
        <text
          fill="white"
          textAnchor="end"
          transform={`translate(${width},75)`}
        >
          1.0
        </text>
      </g>
    </Svg>
  );
}

