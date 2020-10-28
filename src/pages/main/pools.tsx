import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { PoolStore } from "../../stores/pool";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Progress,
  Row,
  UncontrolledTooltip
} from "reactstrap";
import { observer } from "mobx-react";
import { useStore } from "../../stores";
import { Dec } from "@chainapsis/cosmosjs/common/decimal";
import { chainInfo, currencies } from "../../config";

import style from "./pools.module.scss";
import { Pool } from "../../types";
import { MaxAmountIn, MsgJoinPool } from "../../osmosisjs/x/gamm";
import { AccAddress } from "@chainapsis/cosmosjs/common/address";
import { Int } from "@chainapsis/cosmosjs/common/int";
import { OsmosisApi } from "../../osmosisjs/osmosis";
import { toast } from "react-toastify";
import { DecUtils } from "../../common/dec-utils";

export const useSelectPool = (
  poolStore: PoolStore,
  tokenInDenom: string,
  tokenOutDenom: string
) => {
  const [poolId, setPoolId] = useState("");

  useEffect(() => {
    if (!tokenInDenom || !tokenOutDenom) {
      setPoolId("");
    }
  }, [tokenInDenom, tokenOutDenom]);

  const pools = useMemo(
    () =>
      poolStore.getAvailablePools(
        tokenInDenom || "unknown",
        tokenOutDenom || "unknown"
      ),
    [poolStore.pools, tokenInDenom, tokenOutDenom]
  );

  useEffect(() => {
    if (pools.length > 0) {
      setPoolId(pools[0].id);
    }
  }, [pools]);

  return {
    poolId
  };
};

export const PoolsSection: FunctionComponent = observer(() => {
  const { poolStore } = useStore();

  return (
    <Row>
      <Card>
        <CardBody>
          {poolStore.pools.map((pool, i) => {
            return (
              <React.Fragment key={i.toString()}>
                <PoolInfo pool={pool} />
                {i !== poolStore.pools.length - 1 && (
                  <hr
                    style={{
                      width: "100%",
                      borderTopColor: "rgba(255, 255, 255, 0.25)"
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </CardBody>
      </Card>
    </Row>
  );
});

export const PoolInfo: FunctionComponent<{
  pool: Pool;
}> = ({ pool }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(value => !value);

  const poolDenoms = Object.keys(pool.records);
  const totalWeight = poolDenoms.reduce((accumulator: Dec, currentValue) => {
    const weight = pool.records[currentValue];

    return accumulator.add(new Dec(weight.denormalizedWeight));
  }, new Dec(0));
  const weights: {
    symbol: string;
    weight: string;
  }[] = (() => {
    return poolDenoms.map(denom => {
      const record = pool.records[denom];
      const currency = currencies.find(cur => cur.coinMinimalDenom === denom);

      return {
        symbol: currency?.coinDenom ?? denom,
        weight: new Dec(record.denormalizedWeight)
          .quoTruncate(totalWeight)
          .mulTruncate(new Dec(100))
          .toString(0)
          .replace(".", "")
      };
    });
  })();

  const colors = ["primary", "info", "success", "warning", "danger"];

  return (
    <div
      className={style.poolSelectionContainer}
      onClick={e => {
        e.preventDefault();

        setIsModalOpen(true);
      }}
    >
      <p style={{ fontSize: "1.2rem" }}>
        {weights
          .map(weight => `${weight.symbol} (${weight.weight}%)`)
          .join(", ")}
      </p>
      <p style={{ fontSize: "1rem" }}>
        Swap Fee: {new Dec(pool.swapFee).toString(2)}%
      </p>
      <Progress multi>
        {weights.map((weight, i) => {
          return (
            <React.Fragment key={i.toString()}>
              <Progress
                id={`progress-${pool.id}-${i.toString()}`}
                bar
                value={weight.weight}
                color={colors[i % colors.length]}
              />
              <UncontrolledTooltip
                target={`progress-${pool.id}-${i.toString()}`}
              >
                {`${weight.symbol} (${weight.weight}%)`}
              </UncontrolledTooltip>
            </React.Fragment>
          );
        })}
      </Progress>
      <Modal
        className={style.poolModal}
        isOpen={isModalOpen}
        toggle={toggleModal}
      >
        <ModalBody>
          <Card>
            <PoolTxModal
              pool={pool}
              requestCloseModal={() => {
                setIsModalOpen(false);
              }}
            />
          </Card>
        </ModalBody>
      </Modal>
    </div>
  );
};

export const PoolTxModal: FunctionComponent<{
  pool: Pool;
  requestCloseModal: () => void;
}> = observer(({ pool, requestCloseModal }) => {
  const { accountStore } = useStore();

  const [deposits, setDeposits] = useState<{
    [denom: string]: string;
  }>({});

  const [ratios, setRatios] = useState<{
    [denom: string]: Dec;
  }>({});

  const poolDenoms = Object.keys(pool.records);
  const totalWeight = poolDenoms.reduce((accumulator: Dec, currentValue) => {
    const weight = pool.records[currentValue];

    return accumulator.add(new Dec(weight.denormalizedWeight));
  }, new Dec(0));

  useEffect(() => {
    const poolDenoms = Object.keys(pool.records);

    const ratios: {
      [denom: string]: Dec;
    } = {};

    for (const denom of poolDenoms) {
      const record = pool.records[denom];

      ratios[denom] = new Dec(record.denormalizedWeight).quoTruncate(
        totalWeight
      );
    }

    setRatios(ratios);
  }, [pool]);

  const poolAmountOut = (() => {
    const currency = currencies.find(
      cur => cur.coinMinimalDenom === poolDenoms[0]
    );
    if (!currency) {
      throw new Error("TODO: handle error");
    }

    let precision = DecUtils.getPrecisionDec(currency.coinDecimals);

    if (deposits[poolDenoms[0]] && deposits[poolDenoms[0]] !== "0") {
      const ratio = new Dec(deposits[poolDenoms[0]])
        .mulTruncate(precision)
        .quoTruncate(new Dec(pool.records[poolDenoms[0]].balance));

      return ratio.mulTruncate(new Dec(pool.token.totalSupply)).truncate();
    } else {
      return new Int(0);
    }
  })();

  const [isSending, setIsSending] = useState(false);

  const sendJoinPoolMsg = async () => {
    const maxAmountsIn: MaxAmountIn[] = poolDenoms.map(denom => {
      // 병신같음...
      return new MaxAmountIn(denom, new Int("1000000000000000000000000"));
    });

    const cosmosJS = new OsmosisApi({
      chainId: chainInfo.chainId,
      rpc: chainInfo.rpc,
      rest: chainInfo.rest,
      walletProvider: window.cosmosJSWalletProvider!
    });

    await cosmosJS.enable();

    const keys = await cosmosJS.getKeys();

    if (keys.length > 0) {
      const msg = new MsgJoinPool(
        AccAddress.fromBech32(keys[0].bech32Address),
        pool.id,
        poolAmountOut,
        maxAmountsIn
      );

      setIsSending(true);

      try {
        const result = (await cosmosJS.sendMsgs(
          [msg],
          { gas: "200000", memo: "", fee: [] },
          "commit"
        )) as any;

        if (result.status !== 200 || result.statusText !== "OK") {
          toast.error("Failed to join pool");
        } else {
          const code = result.data.code;
          if (code) {
            toast.error("Failed to join pool: " + result.data.raw_log);
          } else {
            toast("Success!");
          }
        }
      } catch {
        toast.error("Failed to join pool");
      } finally {
        requestCloseModal();
        setIsSending(false);
      }
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>Assets</CardHeader>
        <CardBody>
          {Object.keys(pool.records).map(denom => {
            const currency = currencies.find(
              cur => cur.coinMinimalDenom === denom
            );

            if (!currency) {
              return null;
            }

            return (
              <FormGroup key={denom}>
                <Label>{currency.coinDenom}</Label>
                <Input
                  type="number"
                  value={
                    deposits[currency.coinMinimalDenom]
                      ? DecUtils.trim(
                          new Dec(deposits[currency.coinMinimalDenom])
                        )
                      : ""
                  }
                  onChange={e => {
                    e.preventDefault();

                    if (e.target.value) {
                      const deposit = new Dec(e.target.value);
                      const newDeposits = Object.assign({}, deposits);

                      const mul = deposit.quoTruncate(
                        ratios[currency.coinMinimalDenom]
                      );

                      newDeposits[currency.coinMinimalDenom] = e.target.value;

                      for (const denom of poolDenoms) {
                        if (denom !== currency.coinMinimalDenom) {
                          newDeposits[denom] = mul
                            .mulTruncate(ratios[denom])
                            .toString();
                        }
                      }

                      setDeposits(newDeposits);
                    } else {
                      const deposits: { [denom: string]: string } = {};
                      for (const denom of poolDenoms) {
                        deposits[denom] = "";
                      }
                      setDeposits(deposits);
                    }
                  }}
                />
              </FormGroup>
            );
          })}
          <p style={{ color: "white" }}>
            {/* Assume that the all liquidity token has the 6 decimals for now. */}
            Expected Token Out:{" "}
            {DecUtils.trim(
              new Dec(poolAmountOut.toString()).quoTruncate(
                DecUtils.getPrecisionDec(6)
              )
            )}
          </p>
          <Button
            type="submit"
            block
            color="success"
            disabled={
              !accountStore.bech32Address ||
              !deposits[poolDenoms[0]] ||
              deposits[poolDenoms[0]] === "0"
            }
            onClick={async e => {
              e.preventDefault();

              await sendJoinPoolMsg();
            }}
            data-loading={isSending}
          >
            Add Liquidity
          </Button>
        </CardBody>
      </Card>
    </div>
  );
});
