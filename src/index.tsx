import React from "react";
import ReactDOM from "react-dom";

import "./global.scss";

import { MainPage } from "./pages/main";
import { HashRouter, Route } from "react-router-dom";

ReactDOM.render(
  <HashRouter>
    <Route exact path="/" component={MainPage} />
  </HashRouter>,
  document.getElementById("app")
);
