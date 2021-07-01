import React from "react";
// import CovariateCanvas from "./CovariateCanvas";
import PartialDependencePlot from "./PartialDependencePlot";

const CovariateGroup = ({
  name,
  description,
  geotiff_path,
  lng_lat,
  chart_data_path,
  threshold,
}) => (
  <div className="covariate-group">
    <div>
      <small>{description}</small>
    </div>
    <PartialDependencePlot
      chart_data_path={chart_data_path}
      threshold={threshold}
    />
  </div>
);

export default CovariateGroup;
