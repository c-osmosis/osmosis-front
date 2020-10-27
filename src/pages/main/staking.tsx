import React, { FunctionComponent, useState } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../stores";
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
  Row
} from "reactstrap";
import { Validator } from "../../stores/validator/types";
import style from "./pools.module.scss";
import { chainInfo, stakingCurrency } from "../../config";
import { Dec } from "@chainapsis/cosmosjs/common/decimal";
import { AccAddress, ValAddress } from "@chainapsis/cosmosjs/common/address";
import { GaiaApi } from "@chainapsis/cosmosjs/gaia/api";
import { MsgDelegate } from "@chainapsis/cosmosjs/x/staking";
import { Coin } from "@chainapsis/cosmosjs/common/coin";

export const StakingSection: FunctionComponent = observer(() => {
  const { validatorStore } = useStore();

  return (
    <Row>
      <Card>
        <CardBody>
          {validatorStore.validators.map((validator, i) => {
            return (
              <React.Fragment key={i.toString()}>
                <ValidatorInfo validator={validator} />
                {i !== validatorStore.validators.length - 1 && (
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

export const ValidatorInfo: FunctionComponent<{
  validator: Validator;
}> = ({ validator }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(value => !value);

  const moniker = validator.description.moniker;
  const votingPower = validator.tokens;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <p
        style={{
          flex: "1 0 auto",
          fontSize: "1.3rem",
          marginLeft: "10px",
          marginTop: "0px",
          marginBottom: "0px",
          fontWeight: "bold"
        }}
      >
        {moniker}
      </p>
      <p
        style={{
          flex: "0 0 auto",
          marginTop: "0px",
          marginBottom: "0px",
          marginRight: "10px"
        }}
      >
        {votingPower}
      </p>
      <Button
        style={{ flex: "0 0 140px", width: "140px" }}
        type="submit"
        block
        color="success"
        onClick={async e => {
          e.preventDefault();

          setIsModalOpen(true);
        }}
      >
        Staking
      </Button>
      <Modal
        className={style.poolModal}
        isOpen={isModalOpen}
        toggle={toggleModal}
      >
        <ModalBody>
          <Card>
            <StakingModal validator={validator} />
          </Card>
        </ModalBody>
      </Modal>
    </div>
  );
};

export const StakingModal: FunctionComponent<{
  validator: Validator;
}> = observer(({ validator }) => {
  const { accountStore } = useStore();

  const [amount, setAmount] = useState("");

  const sendStakingMsg = async () => {
    const cosmosJS = new GaiaApi({
      chainId: chainInfo.chainId,
      rpc: chainInfo.rpc,
      rest: chainInfo.rest,
      walletProvider: window.cosmosJSWalletProvider!
    });

    cosmosJS.isStargate = true;

    await cosmosJS.enable();

    const keys = await cosmosJS.getKeys();

    let precision = new Dec(1);
    for (let i = 0; i < stakingCurrency.coinDecimals; i++) {
      precision = precision.mul(new Dec(10));
    }

    const amountDec = new Dec(amount).mulTruncate(precision);

    if (keys.length > 0) {
      const msg = new MsgDelegate(
        AccAddress.fromBech32(keys[0].bech32Address),
        ValAddress.fromBech32(validator.operator_address),
        new Coin(stakingCurrency.coinMinimalDenom, amountDec.truncate())
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
    <div>
      <Card>
        <CardHeader>Staking</CardHeader>
        <CardBody>
          <FormGroup key="staking">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={e => {
                e.preventDefault();

                setAmount(e.target.value);
              }}
            />
          </FormGroup>
          <Button
            type="submit"
            block
            color="success"
            onClick={async e => {
              e.preventDefault();

              await sendStakingMsg();
            }}
            disabled={!accountStore.bech32Address}
          >
            Send Staking
          </Button>
        </CardBody>
      </Card>
    </div>
  );
});
