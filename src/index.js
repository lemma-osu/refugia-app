import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { render } from "react-dom";

import Router from "./components/Router";

render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.querySelector("#main")
);
