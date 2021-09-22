import React, { useRef } from "react";
import CovariateCanvas from "./CovariateCanvas";
import PartialDependencePlot from "./PartialDependencePlot";

export default function CovariateGroup({
  name,
  description,
  geotiffPath,
  centerCoord,
  width,
  height,
  chartDataPath,
  xy,
  onLoaded,
}) {
  const variableValue = useRef(0);
  return (
    <div className="covariate-group">
      <div>
        <small>{description}</small>
      </div>
      <CovariateCanvas
        id={name}
        geotiffPath={geotiffPath}
        centerCoord={centerCoord}
        width={width}
        height={height}
        xy={xy}
        variableValue={variableValue}
        onLoaded={onLoaded}
      />
      <PartialDependencePlot
        chartDataPath={chartDataPath}
        variableValue={variableValue.current}
      />
    </div>
  );
}
