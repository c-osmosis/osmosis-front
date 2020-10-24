import React from "react";
import ReactDOM from "react-dom";

import "./global.scss";

import { MainPage } from "./pages/main";
import { HashRouter, Route } from "react-router-dom";
import { StoreProvider } from "./stores";

ReactDOM.render(
  <StoreProvider>
    <HashRouter>
      <Route exact path="/" component={MainPage} />
    </HashRouter>
  </StoreProvider>,
  document.getElementById("app")
);
