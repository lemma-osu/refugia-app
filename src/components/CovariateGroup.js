import React, { useRef } from "react";
import CovariateCanvas from "./CovariateCanvas";
import PartialDependencePlot from "./PartialDependencePlot";

export default function CovariateGroup({
  name,
  description,
  imageData,
  imageStats,
  chartDataPath,
  xy,
}) {
  const variableValue = useRef(0);
  return (
    <div className="covariate-group">
      <div>
        <small>{description}</small>
      </div>
      <CovariateCanvas
        id={name}
        imageData={imageData}
        imageStats={imageStats}
        xy={xy}
        variableValue={variableValue}
      />
      <PartialDependencePlot
        chartDataPath={chartDataPath}
        variableValue={variableValue.current}
      />
    </div>
  );
}
