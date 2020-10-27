import React, { FunctionComponent, useState } from "react";

import { HeaderLayout } from "../../layouts/header-layout";
import { Button, Col, Container, Row, ButtonGroup } from "reactstrap";
import { PoolsSection } from "./pools";
import { StakingSection } from "./staking";
import { observer } from "mobx-react";
import { SwapSection } from "./swap";

enum Role {
  Swap,
  Pools,
  Staking
}

export const MainPage: FunctionComponent = observer(() => {
  const [role, setRole] = useState<Role>(Role.Swap);

  return (
    <HeaderLayout>
      <Container
        fluid
        style={{
          marginTop: "2rem"
        }}
      >
        <Row>
          <Col lg={4} md={2} />
          <Col lg={4} md={8}>
            <Row>
              <ButtonGroup
                size="lg"
                style={{ width: "100%", display: "flex", marginBottom: "1rem" }}
              >
                <Button
                  style={{ flex: 1 }}
                  color={role === Role.Swap ? "success" : undefined}
                  onClick={e => {
                    e.preventDefault();

                    setRole(Role.Swap);
                  }}
                >
                  Swap
                </Button>
                <Button
                  style={{ flex: 1 }}
                  color={role === Role.Pools ? "success" : undefined}
                  onClick={e => {
                    e.preventDefault();

                    setRole(Role.Pools);
                  }}
                >
                  Pools
                </Button>
                <Button
                  style={{ flex: 1 }}
                  color={role === Role.Staking ? "success" : undefined}
                  onClick={e => {
                    e.preventDefault();

                    setRole(Role.Staking);
                  }}
                >
                  Staking
                </Button>
              </ButtonGroup>
            </Row>
            {role === Role.Swap && <SwapSection />}
            {role === Role.Pools && <PoolsSection />}
            {role === Role.Staking && <StakingSection />}
          </Col>
          <Col lg={4} md={2} />
        </Row>
      </Container>
    </HeaderLayout>
  );
});
