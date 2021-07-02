import React from "react";
import CovariateCanvas from "./CovariateCanvas";
import PartialDependencePlot from "./PartialDependencePlot";

const CovariateGroup = ({
  name,
  description,
  geotiff_path,
  clicked_coord,
  chart_data_path,
  threshold,
}) => (
  <div className="covariate-group">
    <div>
      <small>{description}</small>
    </div>
    <CovariateCanvas
      id={name}
      geotiff_path={geotiff_path}
      clicked_coord={clicked_coord}
    />
    <PartialDependencePlot
      chart_data_path={chart_data_path}
      threshold={threshold}
    />
  </div>
);

export default CovariateGroup;
