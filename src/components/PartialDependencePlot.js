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

const xValue = (d) => d.X;
const yValue = (d) => d.Y;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const moveDotFactory = (data, xScale, yScale) => {
  return (variableValue) => {
    // Find the X value that corresponds to the variable value
    // and return the (X,Y) pair at that location
    const idx = clamp(
      bisectLeft(d3map(data, xValue), variableValue),
      0,
      data.length - 1
    );
    var pt = new DOMPoint(xScale(xValue(data[idx])), yScale(yValue(data[idx])));
    return pt;
  };
};

export default function PartialDependencePlot({
  chartDataPath,
  variableValue,
}) {
  const [data, setData] = useState([{ X: 0, Y: 0 }]);
  const [dot, setDot] = useState([0, 0]);

  const width = 223;
  const height = 148;
  const margin = { top: 5, right: 5, bottom: 20, left: 20 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () =>
      scaleLinear().domain(extent(data, xValue)).range([0, innerWidth]).nice(),
    [data, innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear().domain(extent(data, yValue)).range([0, innerHeight]).nice(),
    [data, innerHeight]
  );

  const numTicks = 5;

  const moveDot = useMemo(() => {
    return moveDotFactory(data, xScale, yScale);
  }, [data, xScale, yScale]);

  useEffect(() => {
    async function getData() {
      setData(await csv(chartDataPath, autoType));
    }
    getData();
  }, [chartDataPath]);

  useEffect(() => {
    if (!variableValue) return;
    setDot(moveDot(variableValue));
  }, [variableValue, moveDot]);

  return (
    <Svg width={width} height={height} margin={margin}>
      <XAxis
        xScale={xScale}
        innerHeight={innerHeight}
        numTicks={numTicks}
        tickOffset={7}
      />
      <YAxis
        yScale={yScale}
        innerWidth={innerWidth}
        numTicks={numTicks}
        tickOffset={7}
      />
      <Line
        data={data}
        xScale={xScale}
        yScale={yScale}
        xValue={xValue}
        yValue={yValue}
      />
      <Dot
        d={dot}
        xScale={xScale}
        yScale={yScale}
        xValue={xValue}
        yValue={yValue}
        circleRadius={5}
      />
    </Svg>
  );
}
