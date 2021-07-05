import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { render } from "react-dom";

import App from "./components/App";

fetch("config.json")
  .then((response) => response.json())
  .then((config) => {
    render(
      <React.StrictMode>
        <App config={config} />
      </React.StrictMode>,
      document.querySelector("#main")
    );
  });
