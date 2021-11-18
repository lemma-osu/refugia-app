import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AppWrapper from "./AppWrapper";
import SwipeMapApp from "./SwipeMapApp";
import NotFound from "./NotFound";

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/projects/latest">
          <Redirect to="/projects/v2" />
        </Route>
        <Route exact path="/projects/:project">
          <AppWrapper />
        </Route>
        <Route exact path="/swipe">
          <SwipeMapApp />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
