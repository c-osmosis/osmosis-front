import React, { FunctionComponent } from "react";

import { Container, Navbar, NavbarBrand } from "reactstrap";
import { observer } from "mobx-react";
import { useStore } from "../../stores";

export const HeaderLayout: FunctionComponent = observer(props => {
  const { children } = props;

  const { accountStore } = useStore();

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
          {accountStore.bech32Address}
        </Container>
      </Navbar>
      <div>{children}</div>
    </div>
  );
});
