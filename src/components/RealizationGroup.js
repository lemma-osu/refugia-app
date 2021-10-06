import React, { useRef, useEffect } from "react";
import PartialDependencePlot from "./PartialDependencePlot";
import { ResponseVariableDropdown } from "./Dropdown";

export default function RealizationGroup({
  v,
  imageData,
  selected,
  chartDataPath,
  xy,
  onChange,
}) {
  const variableValue = useRef(0);
  const arr = useRef();
  arr.current = imageData[selected - 1];

  useEffect(() => {
    if (!arr.current) return;
    const offset = parseInt(xy.y, 10) * arr.current.width + parseInt(xy.x, 10);
    variableValue.current = arr.current[0][offset];
  }, [xy, variableValue]);

  return (
    <div className="realization-group">
      <ResponseVariableDropdown
        v={v}
        selected={selected}
        className="mb-2"
        onChange={onChange}
      />
      <PartialDependencePlot
        chartDataPath={chartDataPath}
        variableValue={variableValue.current}
        width={250}
        height={148}
      />
    </div>
  );
}
