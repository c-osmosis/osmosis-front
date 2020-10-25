import React, { FunctionComponent, useEffect, useState } from "react";

import { HeaderLayout } from "../../layouts/header-layout";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Dropdown,
  Input,
  Row,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from "reactstrap";
import { PoolsInfo } from "./pools";
import { chainInfo, currencies } from "../../config";
import { OsmosisApi } from "../../osmosisjs/osmosis";
import { MsgSwapExactAmountIn } from "../../osmosisjs/x/gamm";
import { AccAddress } from "@chainapsis/cosmosjs/common/address";
import { Coin } from "@chainapsis/cosmosjs/common/coin";
import { Int } from "@chainapsis/cosmosjs/common/int";
import { Dec } from "@chainapsis/cosmosjs/common/decimal";
import { observer } from "mobx-react";
import { useStore } from "../../stores";
import Axios from "axios";

export const MainPage: FunctionComponent = observer(() => {
  const { accountStore } = useStore();

  const [tokenInDenom, _setTokenInDenom] = useState("");
  const [tokenOutDenom, setTokenOutDenom] = useState("");
  const setTokenInDenom = (denom: string) => {
    if (denom === tokenOutDenom) {
      setTokenOutDenom("");
    }
    _setTokenInDenom(denom);
  };

  const [isTokenInDropdownOpen, setIsTokenInDropdownOpen] = useState(false);
  const [isTokenOutDropdownOpen, setIsTokenOutDropdownOpen] = useState(false);

  const [tokenInAmount, setTokenInAmount] = useState("");
  const [estimatedTokenOutAmount, setEstimatedTokenOutAmount] = useState("");
  const [poolId, setPoolId] = useState("");

  useEffect(() => {
    if (
      tokenInDenom &&
      tokenInAmount &&
      tokenOutDenom &&
      poolId &&
      accountStore.bech32Address
    ) {
      const restInstance = Axios.create({
        baseURL: chainInfo.rest
      });

      (async () => {
        const currency = currencies.find(
          cur => cur.coinMinimalDenom === tokenInDenom
        );
        if (!currency) {
          throw new Error("TODO: handle error");
        }

        const dec = new Dec(tokenInAmount);
        let precision = new Dec(1);
        for (let i = 0; i < currency.coinDecimals; i++) {
          precision = precision.mul(new Dec(10));
        }
        const int = dec.mulTruncate(precision).truncate();

        const result = await restInstance.get<{
          tokenAmountOut: string;
          spotPriceAfter: string;
        }>(
          `/osmosis/gamm/v1beta1/${poolId}/estimate/swap_exact_amount_in?sender=${
            accountStore.bech32Address
          }&tokenIn=${int.toString() +
            currency.coinMinimalDenom}&tokenOutDenom=${tokenOutDenom}`
        );

        // TODO: handle error.
        if (result.status === 200) {
          const currency = currencies.find(
            cur => cur.coinMinimalDenom === tokenOutDenom
          );
          if (!currency) {
            throw new Error("TODO: handle error");
          }

          let dec = new Dec(result.data.tokenAmountOut);
          let precision = new Dec(1);
          for (let i = 0; i < currency.coinDecimals; i++) {
            precision = precision.mul(new Dec(10));
          }
          dec = dec.quoTruncate(precision);

          setEstimatedTokenOutAmount(dec.toString(currency.coinDecimals));
        }
      })();
    } else {
      setEstimatedTokenOutAmount("");
    }
  }, [
    tokenInDenom,
    tokenInAmount,
    tokenOutDenom,
    poolId,
    accountStore.bech32Address
  ]);

  const sendSwapMsg = async () => {
    const cosmosJS = new OsmosisApi({
      chainId: chainInfo.chainId,
      rpc: chainInfo.rpc,
      rest: chainInfo.rest,
      walletProvider: window.cosmosJSWalletProvider!
    });

    await cosmosJS.enable();

    const keys = await cosmosJS.getKeys();

    if (keys.length > 0) {
      const currency = currencies.find(
        cur => cur.coinMinimalDenom === tokenInDenom
      );
      if (!currency) {
        throw new Error("TODO: handle error");
      }

      const dec = new Dec(tokenInAmount);
      let precision = new Dec(1);
      for (let i = 0; i < currency.coinDecimals; i++) {
        precision = precision.mul(new Dec(10));
      }
      const int = dec.mulTruncate(precision).truncate();

      const msg = new MsgSwapExactAmountIn(
        AccAddress.fromBech32(keys[0].bech32Address),
        poolId,
        new Coin(tokenInDenom, int.toString()),
        tokenOutDenom,
        new Int("1"),
        new Int("9999999999999999")
      );

      console.log(
        await cosmosJS.sendMsgs(
          [msg],
          { gas: "200000", memo: "", fee: [] },
          "commit"
        )
      );
    }
  };

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
                        <CardBody>
                          <Dropdown
                            isOpen={isTokenInDropdownOpen}
                            toggle={() =>
                              setIsTokenInDropdownOpen(value => !value)
                            }
                          >
                            <DropdownToggle caret>
                              {currencies.find(
                                cur => cur.coinMinimalDenom === tokenInDenom
                              )?.coinDenom || "Select"}
                            </DropdownToggle>
                            <DropdownMenu>
                              {currencies.map(currency => {
                                return (
                                  <DropdownItem
                                    onClick={e => {
                                      e.preventDefault();

                                      setTokenInDenom(
                                        currency.coinMinimalDenom
                                      );
                                    }}
                                  >
                                    {currency.coinDenom}
                                  </DropdownItem>
                                );
                              })}
                            </DropdownMenu>
                          </Dropdown>
                        </CardBody>
                        <CardFooter>
                          <Input
                            placeholder="Amount"
                            type="number"
                            value={tokenInAmount}
                            onChange={e => {
                              e.preventDefault();

                              setTokenInAmount(e.target.value);
                            }}
                          />
                        </CardFooter>
                      </Card>
                    </Col>
                    <Col xs={3} />
                    <Col>
                      <Card style={{ textAlign: "center" }}>
                        <CardHeader>Token to buy</CardHeader>
                        <CardBody>
                          <Dropdown
                            isOpen={isTokenOutDropdownOpen}
                            toggle={() =>
                              setIsTokenOutDropdownOpen(value => !value)
                            }
                          >
                            <DropdownToggle caret>
                              {currencies.find(
                                cur => cur.coinMinimalDenom === tokenOutDenom
                              )?.coinDenom || "Select"}
                            </DropdownToggle>
                            <DropdownMenu>
                              {currencies.map(currency => {
                                if (
                                  currency.coinMinimalDenom === tokenInDenom
                                ) {
                                  return null;
                                }

                                return (
                                  <DropdownItem
                                    onClick={e => {
                                      e.preventDefault();

                                      setTokenOutDenom(
                                        currency.coinMinimalDenom
                                      );
                                    }}
                                  >
                                    {currency.coinDenom}
                                  </DropdownItem>
                                );
                              })}
                            </DropdownMenu>
                          </Dropdown>
                        </CardBody>
                        <CardFooter>
                          <Input
                            placeholder="Amount"
                            readOnly
                            value={estimatedTokenOutAmount}
                          />
                        </CardFooter>
                      </Card>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Row>
            {/* 대충 풀 관련된 정보 보여주는 카드 */}
            <Row>
              <Card>
                <CardHeader>Select Pool</CardHeader>
                <CardBody>
                  <PoolsInfo
                    tokenInDenom={tokenInDenom}
                    tokenOutDenom={tokenOutDenom}
                    onPoolSelected={(id: string) => setPoolId(id)}
                  />
                </CardBody>
              </Card>
            </Row>
            {/* 대충 트랜잭션 보내는 버튼 */}
            <Row>
              <Col />
              <Col>
                <Button
                  color="primary"
                  size="lg"
                  block
                  disabled={
                    !tokenInDenom ||
                    !tokenOutDenom ||
                    !tokenInAmount ||
                    !poolId ||
                    !accountStore.bech32Address
                  }
                  onClick={async e => {
                    e.preventDefault();

                    await sendSwapMsg();
                  }}
                >
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
});
