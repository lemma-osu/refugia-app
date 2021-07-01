import React from "react";
import CovariateGroup from "./CovariateGroup";

const CovariateContainer = ({ covariates, threshold }) => {
  const lng_lat = { lng: -122.8, lat: 44 };
  return (
    <div id="covariate-panel" className="col-md-12">
      {covariates.map((covariate) => (
        <CovariateGroup
          key={covariate.name}
          name={covariate.name}
          description={covariate.description}
          lng_lat={lng_lat}
          geotiff_path={covariate.geotiff_path}
          chart_data_path={covariate.chart_data_path}
          threshold={threshold}
        />
      ))}
    </div>
  );
};

export default CovariateContainer;
