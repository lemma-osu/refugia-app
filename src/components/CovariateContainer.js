import React from "react";
import CovariateGroup from "./CovariateGroup";

const CovariateContainer = ({ covariates, clicked_coord, threshold }) => {
  return (
    <div id="covariate-panel" className="col-md-12">
      {covariates.map((covariate) => (
        <CovariateGroup
          key={covariate.name}
          name={covariate.name}
          description={covariate.description}
          clicked_coord={clicked_coord}
          geotiff_path={covariate.geotiff_path}
          chart_data_path={covariate.chart_data_path}
          threshold={threshold}
        />
      ))}
    </div>
  );
};

export default CovariateContainer;
