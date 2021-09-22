import React from "react";
import CovariateGroup from "./CovariateGroup";

export default function CovariateContainer({
  covariates,
  centerCoord,
  width,
  height,
  xy,
  onLoaded,
}) {
  return (
    <div id="covariate-panel" className="col-md-12">
      {covariates.map((covariate) => (
        <CovariateGroup
          key={covariate.name}
          name={covariate.name}
          description={covariate.description}
          centerCoord={centerCoord}
          width={width}
          height={height}
          geotiffPath={covariate.geotiff_path}
          chartDataPath={covariate.chart_data_path}
          xy={xy}
          onLoaded={onLoaded}
        />
      ))}
    </div>
  );
}
