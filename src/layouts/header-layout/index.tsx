import React, { FunctionComponent } from "react";

import { Container, Navbar, NavbarBrand } from "reactstrap";
import { observer } from "mobx-react";
import { useStore } from "../../stores";

import style from "./style.module.scss";

import classnames from "classnames";

export const HeaderLayout: FunctionComponent = observer(props => {
  const { children } = props;

  const { accountStore } = useStore();

  return (
    <div>
      <div className={classnames(style.squares, style.square1)} />
      <div className={classnames(style.squares, style.square2)} />
      <div className={classnames(style.squares, style.square3)} />
      <div className={classnames(style.squares, style.square4)} />
      <div className={classnames(style.squares, style.square5)} />
      <div className={classnames(style.squares, style.square6)} />
      <div className={classnames(style.squares, style.square7)} />
      <Navbar
        expand="lg"
        color="transparent"
        style={{
          minHeight: "4rem"
        }}
      >
        <Container>
          <NavbarBrand href="/">
            <img
              src={require("../../assets/osmo_logo.png")}
              height={40}
              width={130}
            />
          </NavbarBrand>
          {accountStore.bech32Address}
        </Container>
      </Navbar>
      <div>{children}</div>
    </div>
  );
});
