import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router";

import App from "./App";

export default function AppWrapper() {
  const [config, setConfig] = useState(null);
  let { url } = useRouteMatch();

  useEffect(() => {
    if (config) return;
    const configFn = `${url}/config.json`;
    fetch(configFn)
      .then((response) => response.json())
      .then((data) => {
        setConfig(data);
      });
  }, [config, url]);

  return <>{config && <App config={config} />}</>;
}
