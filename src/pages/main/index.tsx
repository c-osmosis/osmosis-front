import React, { FunctionComponent } from "react";

import { HeaderLayout } from "../../layouts/header-layout";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row
} from "reactstrap";
import { PoolsInfo } from "./pools";

export const MainPage: FunctionComponent = () => {
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
          <Col>
            {/* 대충 사고팔 자산 선택하는 카드 */}
            <Row>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <Card style={{ textAlign: "center" }}>
                        <CardHeader>Token to sell</CardHeader>
                        <CardBody>ATOM</CardBody>
                      </Card>
                    </Col>
                    <Col xs={3} />
                    <Col>
                      <Card style={{ textAlign: "center" }}>
                        <CardHeader>Token to buy</CardHeader>
                        <CardBody>IRIS</CardBody>
                      </Card>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Row>
            {/* 대충 풀 관련된 정보 보여주는 카드 */}
            <Row>
              <Card>
                <CardBody>
                  <PoolsInfo />
                </CardBody>
              </Card>
            </Row>
            {/* 대충 트랜잭션 보내는 버튼 */}
            <Row>
              <Col />
              <Col>
                <Button color="primary" size="lg" block>
                  Swap
                </Button>
              </Col>
              <Col />
            </Row>
          </Col>
          <Col lg={4} md={2} />
        </Row>
      </Container>
    </HeaderLayout>
  );
};
