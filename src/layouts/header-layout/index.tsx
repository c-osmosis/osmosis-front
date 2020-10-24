import React, { FunctionComponent } from "react";

import { Container, Navbar, NavbarBrand } from "reactstrap";

export const HeaderLayout: FunctionComponent = props => {
  const { children } = props;

  return (
    <div>
      <Navbar
        expand="lg"
        color="transparent"
        style={{
          minHeight: "4rem"
        }}
      >
        <Container>
          <NavbarBrand href="/">Osmosis</NavbarBrand>
        </Container>
      </Navbar>
      <div>{children}</div>
    </div>
  );
};
