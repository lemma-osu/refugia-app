import React, { useRef } from "react";
import CovariateCanvas from "./CovariateCanvas";
import PartialDependencePlot from "./PartialDependencePlot";

const CovariateGroup = ({
  name,
  description,
  geotiff_path,
  clicked_coord,
  chart_data_path,
  xy,
}) => {
  const variable_value = useRef(0);
  return (
    <div className="covariate-group">
      <div>
        <small>{description}</small>
      </div>
      <CovariateCanvas
        id={name}
        geotiff_path={geotiff_path}
        clicked_coord={clicked_coord}
        xy={xy}
        variable_value={variable_value}
      />
      <PartialDependencePlot
        chart_data_path={chart_data_path}
        variable_value={variable_value.current}
      />
    </div>
  );
};

export default CovariateGroup;
