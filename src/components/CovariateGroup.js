import React, { useRef } from "react";
import CovariateCanvas from "./CovariateCanvas";
import PartialDependencePlot from "./PartialDependencePlot";
import { CovariateColorRamp } from "./ColorRamp";
import { COVARIATE_RAMP } from "../utils";

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
      <CovariateColorRamp
        specification={COVARIATE_RAMP}
        name={name}
        imageStats={imageStats}
        width={223}
        height={20}
      />
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
