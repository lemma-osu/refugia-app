import React, { useRef } from "react";
import CovariateCanvas from "./CovariateCanvas";
import PartialDependencePlot from "./PartialDependencePlot";

const CovariateGroup = ({
  name,
  description,
  geotiffPath,
  clickedCoord,
  chartDataPath,
  xy,
  loadedFunc,
}) => {
  const variableValue = useRef(0);
  return (
    <div className="covariate-group">
      <div>
        <small>{description}</small>
      </div>
      <CovariateCanvas
        id={name}
        geotiffPath={geotiffPath}
        clickedCoord={clickedCoord}
        xy={xy}
        variableValue={variableValue}
        loadedFunc={loadedFunc}
      />
      <PartialDependencePlot
        chartDataPath={chartDataPath}
        variableValue={variableValue.current}
      />
    </div>
  );
};

export default CovariateGroup;
