import React from "react";
import ReactDOM from "react-dom";

import "./global.scss";

import { MainPage } from "./pages/main";
import { HashRouter, Route } from "react-router-dom";
import { StoreProvider } from "./stores";

require("./assets/sosmo_logo.png");

ReactDOM.render(
  <StoreProvider>
    <HashRouter>
      <Route exact path="/" component={MainPage} />
    </HashRouter>
  </StoreProvider>,
  document.getElementById("app")
);
