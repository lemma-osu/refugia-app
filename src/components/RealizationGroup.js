import React, { useRef, useEffect } from "react";
import PartialDependencePlot from "./PartialDependencePlot";
import { ResponseVariableDropdown } from "./Dropdown";
import { unscaleArray } from "../utils";

export default function RealizationGroup({
  v,
  imageData,
  selected,
  config,
  xy,
  onChange,
}) {
  const variableValue = useRef(0);
  const arr = useRef();
  const title = `${v.description} (${config.variable_importance.toFixed(2)}%)`;

  useEffect(() => {
    const image = imageData[selected - 1];
    const scale = config.geotiff_paths[selected - 1].scale;
    const offset = config.geotiff_paths[selected - 1].offset;
    arr.current = unscaleArray(image, scale, offset);
  }, [arr, imageData, selected, config]);

  useEffect(() => {
    if (!arr.current) return;
    const offset = parseInt(xy.y, 10) * arr.current.width + parseInt(xy.x, 10);
    variableValue.current = arr.current[0][offset];
  }, [xy, variableValue]);

  return (
    <div className="realization-group">
      <ResponseVariableDropdown
        name={v.name}
        title={title}
        options={v.steps}
        selected={selected}
        className="mb-2"
        onChange={onChange}
      />
      <PartialDependencePlot
        chartDataPath={config.chart_data_path}
        variableValue={variableValue.current}
        width={250}
        height={148}
        units={config.units}
      />
    </div>
  );
}
