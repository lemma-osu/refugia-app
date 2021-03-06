import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Modal } from "bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import { getPercentiles } from "../utils";
import { useFetchGeotiffs } from "../hooks/useFetchGeotiffs";

import ResponseCanvas from "./ResponseCanvas";
import CovariateContainer from "./CovariateContainer";
import RealizationGroup from "./RealizationGroup";
import { CovariateColorRamp } from "./ColorRamp";
import { ResponseVariableDropdown } from "./Dropdown";

const scenarioOptions = [
  { value: 0, label: "Mild (90th RH, 10th Tmmx)" },
  { value: 1, label: "Moderate (50th RH, 50th Tmmx)" },
  { value: 2, label: "Extreme (10th RH, 90th Tmmx)" },
];

// Get image paths from configuration
function returnPaths(obj) {
  return obj.map(({ geotiff_path }) => geotiff_path);
}

// Get image paths from dynamic covariates
function returnDynamicPaths(obj) {
  return obj.geotiff_paths.map(({ path }) => path);
}

export default function MiwPanel({
  config,
  miwResponseIdx,
  miwLocation,
  miwSize,
  currentSurface,
  currentRegion,
  ramp,
  onHide,
}) {
  const modal = useRef(null);

  const [responseStats, setResponseStats] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(miwResponseIdx);
  const [xy, setXy] = useState({ x: 0, y: 0 });

  const surfaceConfig = config.probability_surfaces[currentSurface];
  const regionConfig = surfaceConfig.regions[currentRegion];

  // Get the responses
  const responses = surfaceConfig.responses;

  useEffect(() => {
    setResponseStats(
      responses.map((r) => ({
        min: 0.0,
        max: 1.0,
        scale: 10000.0,
        offset: 0.0,
        noData: r.nodata,
      }))
    );
  }, [responses]);

  const realizations = surfaceConfig.realizations;

  const covariatePaths = useMemo(() => {
    return returnPaths(regionConfig.static_covariates);
  }, [regionConfig]);

  const responsePaths = useMemo(() => {
    return returnPaths(responses);
  }, [responses]);

  const firstVaryingPaths = useMemo(() => {
    return returnDynamicPaths(regionConfig.dynamic_covariates[0]);
  }, [regionConfig.dynamic_covariates]);

  const secondVaryingPaths = useMemo(() => {
    return returnDynamicPaths(regionConfig.dynamic_covariates[1]);
  }, [regionConfig.dynamic_covariates]);

  // Retrieve all the needed images
  const { lng, lat } = miwLocation;
  const [width, height] = miwSize;
  const {
    loading: covariateLoading,
    done: covariateDone,
    data: covariateData,
  } = useFetchGeotiffs({
    paths: covariatePaths,
    lng: lng,
    lat: lat,
    width: width,
    height: height,
  });
  const {
    loading: responseLoading,
    done: responseDone,
    data: responseData,
  } = useFetchGeotiffs({
    paths: responsePaths,
    lng: lng,
    lat: lat,
    width: width,
    height: height,
  });
  const {
    loading: firstVaryingLoading,
    done: firstVaryingDone,
    data: firstVaryingData,
  } = useFetchGeotiffs({
    paths: firstVaryingPaths,
    lng: lng,
    lat: lat,
    width: width,
    height: height,
  });
  const {
    loading: secondVaryingLoading,
    done: secondVaryingDone,
    data: secondVaryingData,
  } = useFetchGeotiffs({
    paths: secondVaryingPaths,
    lng: lng,
    lat: lat,
    width: width,
    height: height,
  });
  const imageCount =
    regionConfig.static_covariates.length +
    responses.length +
    regionConfig.dynamic_covariates[0].geotiff_paths.length +
    regionConfig.dynamic_covariates[1].geotiff_paths.length;
  const percent =
    ((covariateDone + responseDone + firstVaryingDone + secondVaryingDone) /
      imageCount) *
    100;
  const loading =
    covariateLoading ||
    responseLoading ||
    firstVaryingLoading ||
    secondVaryingLoading;

  const handleScenarioChange = (event) => {
    setCurrentIdx(+event.target.value);
    setXy((xy) => ({ x: xy.x, y: xy.y }));
  };

  const handleResponseMousemove = useCallback((event) => {
    const rect = event.target.getBoundingClientRect();
    const scaleX = event.target.width / rect.width;
    const scaleY = event.target.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    setXy({ x: x, y: y });
  }, []);

  useEffect(() => {
    if (modal.current) return;
    const modalDiv = document.querySelector("#miw-modal");
    modalDiv.addEventListener("hidden.bs.modal", onHide);
    modal.current = new Modal(modalDiv);
    modal.current.show();
  }, [onHide]);

  useEffect(() => {
    const promises = regionConfig.static_covariates.map((c) =>
      getPercentiles(c.statistics_path, [2, 98])
    );
    Promise.all(promises).then((data) => {
      regionConfig.static_covariates.forEach((d, i) => {
        d["min"] = data[i][0];
        d["max"] = data[i][1];
      });
    });
  }, [regionConfig]);

  const Loading = ({ progress }) => (
    <>
      <h5>Loading all images</h5>
      <ProgressBar now={progress} />
    </>
  );

  return (
    <div
      className="modal fade"
      id="miw-modal"
      tabIndex="-1"
      aria-labelledby="miw-model-label"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div id="miw-content" className="modal-content">
          <div className="modal-header">
            <h5>Model Inspector Window (MIW)</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body container-fluid">
            {loading && <Loading progress={percent} />}
            {!loading && (
              <>
                <div className="row">
                  <div id="response-panel" className="col-md-6">
                    <CovariateColorRamp
                      specification={ramp}
                      name="response"
                      imageStats={{ min: 0, max: 1 }}
                      width={541}
                      height={20}
                    />
                    <ResponseCanvas
                      responseData={responseData}
                      responseStats={responseStats}
                      currentIdx={currentIdx}
                      onMouseMove={handleResponseMousemove}
                    />
                  </div>
                  <div id="ui" className="col-md-6">
                    <h6>
                      Probability map: {surfaceConfig.description} | Region:{" "}
                      {regionConfig.description}
                    </h6>
                    <p>
                      The map on the left is refugial probability. Each map
                      below is a covariate that helps determine probability of
                      refugia. As you mouse over the map on the left, the
                      corresponding covariates values at the mouse location are
                      shown in the response curves below.
                    </p>
                    <ResponseVariableDropdown
                      name="scenario"
                      title="Fire Weather Extremity Scenario"
                      options={scenarioOptions}
                      selected={currentIdx}
                      className="mt-1 mb-2"
                      onChange={handleScenarioChange}
                    />
                    <div id="realization-panel" className="col-md-12">
                      <RealizationGroup
                        v={realizations[0]}
                        imageData={firstVaryingData}
                        selected={currentIdx}
                        config={regionConfig.dynamic_covariates[0]}
                        xy={xy}
                      />
                      <RealizationGroup
                        v={realizations[1]}
                        imageData={secondVaryingData}
                        selected={currentIdx}
                        config={regionConfig.dynamic_covariates[1]}
                        xy={xy}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <CovariateContainer
                    covariates={regionConfig.static_covariates}
                    covariateData={covariateData}
                    xy={xy}
                  />
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
