import React from "react";
import CovariateGroup from "./CovariateGroup";

const CovariateContainer = ({ covariates, clickedCoord, xy, loadedFunc }) => {
  return (
    <div id="covariate-panel" className="col-md-12">
      {covariates.map((covariate) => (
        <CovariateGroup
          key={covariate.name}
          name={covariate.name}
          description={covariate.description}
          clickedCoord={clickedCoord}
          geotiffPath={covariate.geotiffPath}
          chartDataPath={covariate.chartDataPath}
          xy={xy}
          loadedFunc={loadedFunc}
        />
      ))}
    </div>
  );
};

export default CovariateContainer;
