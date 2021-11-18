import React, { useRef, useState, useEffect } from "react";
import PartialDependencePlot from "./PartialDependencePlot";
import { unscaleArray } from "../utils";

export default function RealizationGroup({
  v,
  imageData,
  selected,
  config,
  xy,
}) {
  const arr = useRef();
  const [variableValue, setVariableValue] = useState(0);
  const title = `${v.description} (${config.variable_importance.toFixed(2)}%)`;

  useEffect(() => {
    const image = imageData[selected];
    const scale = config.geotiff_paths[selected].scale;
    const offset = config.geotiff_paths[selected].offset;
    arr.current = unscaleArray(image, scale, offset);
  }, [arr, imageData, selected, config]);

  useEffect(() => {
    if (!arr.current) return;
    const offset = parseInt(xy.y, 10) * arr.current.width + parseInt(xy.x, 10);
    setVariableValue(arr.current[0][offset]);
  }, [xy]);

  return (
    <div className="realization-group">
      <div>
        <small>{title}</small>
      </div>
      <PartialDependencePlot
        chartDataPath={config.chart_data_path}
        variableValue={variableValue}
        width={250}
        height={148}
        units={config.units}
      />
    </div>
  );
}
