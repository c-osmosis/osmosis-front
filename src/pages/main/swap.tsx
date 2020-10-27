import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../stores";
import { useSelectPool } from "./pools";
import Axios from "axios";
import { chainInfo, currencies } from "../../config";
import { Dec } from "@chainapsis/cosmosjs/common/decimal";
import { OsmosisApi } from "../../osmosisjs/osmosis";
import { MsgSwapExactAmountIn } from "../../osmosisjs/x/gamm";
import { AccAddress } from "@chainapsis/cosmosjs/common/address";
import { Coin } from "@chainapsis/cosmosjs/common/coin";
import { Int } from "@chainapsis/cosmosjs/common/int";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row
} from "reactstrap";

import { toast } from "react-toastify";

export const SwapSection: FunctionComponent = observer(() => {
  const { accountStore, poolStore } = useStore();

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

  const { poolId } = useSelectPool(poolStore, tokenInDenom, tokenOutDenom);

  const [estimationError, setEstimationError] = useState("");

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

        try {
          const result = await restInstance.get<{
            tokenAmountOut: string;
            spotPriceAfter: string;
          }>(
            `/osmosis/gamm/v1beta1/${poolId}/estimate/swap_exact_amount_in?sender=${
              accountStore.bech32Address
            }&tokenIn=${int.toString() +
              currency.coinMinimalDenom}&tokenOutDenom=${tokenOutDenom}`
          );

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
            setEstimationError("");
          }
        } catch (e) {
          if (e.response?.data?.message) {
            setEstimationError(e.response.data.message);
          } else {
            setEstimationError(
              "Failed to estimate the swap result by unknown reason"
            );
          }
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

      const result = (await cosmosJS.sendMsgs(
        [msg],
        { gas: "200000", memo: "", fee: [] },
        "commit"
      )) as any;

      if (result.status !== 200 || result.statusText !== "OK") {
        toast.error("Failed to swap");
      } else {
        const code = result.data.code;
        if (code) {
          toast.error("Failed to swap: " + result.data.raw_log);
        } else {
          toast("Success!");
        }
      }
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Card>
          <CardBody>
            <Row>
              <Col>
                <Card style={{ textAlign: "center", marginBottom: 0 }}>
                  <CardHeader>Token to sell</CardHeader>
                  <CardBody
                    style={{
                      display: "flex",
                      justifyContent: "center"
                    }}
                  >
                    <Dropdown
                      isOpen={isTokenInDropdownOpen}
                      toggle={() => setIsTokenInDropdownOpen(value => !value)}
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
                              key={currency.coinMinimalDenom}
                              onClick={e => {
                                e.preventDefault();

                                setTokenInDenom(currency.coinMinimalDenom);
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
              <Col>
                <Card style={{ textAlign: "center", marginBottom: 0 }}>
                  <CardHeader>Token to buy</CardHeader>
                  <CardBody
                    style={{
                      display: "flex",
                      justifyContent: "center"
                    }}
                  >
                    <Dropdown
                      isOpen={isTokenOutDropdownOpen}
                      toggle={() => setIsTokenOutDropdownOpen(value => !value)}
                    >
                      <DropdownToggle caret>
                        {currencies.find(
                          cur => cur.coinMinimalDenom === tokenOutDenom
                        )?.coinDenom || "Select"}
                      </DropdownToggle>
                      <DropdownMenu>
                        {currencies.map(currency => {
                          if (currency.coinMinimalDenom === tokenInDenom) {
                            return null;
                          }

                          return (
                            <DropdownItem
                              key={currency.coinMinimalDenom}
                              onClick={e => {
                                e.preventDefault();

                                setTokenOutDenom(currency.coinMinimalDenom);
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
                      style={{
                        backgroundColor: "transparent",
                        color: "rgba(255, 255, 255, 0.8)"
                      }}
                      value={estimatedTokenOutAmount}
                    />
                  </CardFooter>
                </Card>
              </Col>
            </Row>
            {estimationError &&
              tokenInDenom &&
              tokenOutDenom &&
              tokenInAmount && (
                <div style={{ color: "red", textAlign: "center" }}>
                  {estimationError}
                </div>
              )}
          </CardBody>
        </Card>
      </Row>
      {/* 대충 트랜잭션 보내는 버튼 */}
      <Row>
        <Col />
        <Col>
          <Button
            color="success"
            size="lg"
            block
            disabled={
              estimationError.length > 0 ||
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
    </React.Fragment>
  );
});
