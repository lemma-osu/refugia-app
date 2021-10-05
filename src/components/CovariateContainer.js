import React from "react";
import CovariateGroup from "./CovariateGroup";
import { zip } from "../utils";

export default function CovariateContainer({ covariates, covariateData, xy }) {
  return (
    <div id="covariate-panel" className="col-md-12">
      {zip([covariates, covariateData]).map(([covariate, data]) => (
        <CovariateGroup
          key={covariate.name}
          name={covariate.name}
          description={covariate.description}
          imageData={data}
          imageStats={{
            min: covariate.min,
            max: covariate.max,
            noData: covariate.nodata,
          }}
          chartDataPath={covariate.chart_data_path}
          xy={xy}
        />
      ))}
    </div>
  );
}
