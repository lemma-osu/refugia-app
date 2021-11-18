import React, { useEffect, useState } from "react";
import CovariateGroup from "./CovariateGroup";
import { zip } from "../utils";

export default function CovariateContainer({ covariates, covariateData, xy }) {
  const [imageStats, setImageStats] = useState(null);

  useEffect(() => {
    setImageStats(
      covariates.map((covariate) => ({
        min: covariate.min,
        max: covariate.max,
        scale: covariate.scale,
        offset: covariate.offset,
        noData: covariate.nodata,
      }))
    );
  }, [covariates]);

  return (
    <>
      {imageStats && (
        <div id="covariate-panel" className="col-md-12">
          {zip([covariates, covariateData, imageStats]).map(
            ([covariate, data, stats]) => (
              <CovariateGroup
                key={covariate.name}
                name={covariate.name}
                description={covariate.description}
                importance={covariate.variable_importance}
                units={covariate.units}
                imageData={data}
                imageStats={stats}
                chartDataPath={covariate.chart_data_path}
                xy={xy}
              />
            )
          )}
        </div>
      )}
    </>
  );
}
