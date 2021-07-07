import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router";

import App from "./App";

const AppWrapper = () => {
  const [config, set_config] = useState(null);
  let { url } = useRouteMatch();

  useEffect(() => {
    if (config) return;
    const config_fn = `${url}/config.json`;
    fetch(config_fn)
      .then((response) => response.json())
      .then((data) => {
        set_config(data);
      });
  }, [config, url]);

  return <>{config && <App config={config} />}</>;
};

export default AppWrapper;
