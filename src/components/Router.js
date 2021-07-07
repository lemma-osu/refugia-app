import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import AppWrapper from "./AppWrapper";
import NotFound from "./NotFound";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/projects/:project">
        <AppWrapper />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Router;
