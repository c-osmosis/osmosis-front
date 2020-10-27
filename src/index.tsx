import React from "react";
import ReactDOM from "react-dom";

import "./global.scss";

import { MainPage } from "./pages/main";
import { HashRouter, Route } from "react-router-dom";
import { StoreProvider } from "./stores";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

require("./assets/sosmo_logo.png");

ReactDOM.render(
  <StoreProvider>
    <HashRouter>
      <ToastContainer />
      <Route exact path="/" component={MainPage} />
    </HashRouter>
  </StoreProvider>,
  document.getElementById("app")
);
