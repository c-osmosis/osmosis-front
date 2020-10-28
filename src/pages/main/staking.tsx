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
  Row,
  Table
} from "reactstrap";
import { Validator } from "../../stores/validator/types";
import style from "./pools.module.scss";
import { chainInfo, stakingCurrency } from "../../config";
import { Dec } from "@chainapsis/cosmosjs/common/decimal";
import { AccAddress, ValAddress } from "@chainapsis/cosmosjs/common/address";
import { GaiaApi } from "@chainapsis/cosmosjs/gaia/api";
import { MsgDelegate } from "@chainapsis/cosmosjs/x/staking";
import { Coin } from "@chainapsis/cosmosjs/common/coin";
import { DecUtils } from "../../common/dec-utils";
import { toast } from "react-toastify";

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
  const votingPower = new Dec(validator.tokens).quoTruncate(
    DecUtils.getPrecisionDec(stakingCurrency.coinDecimals)
  );

  return (
    <div
      style={{
        display: "flex",
        flex: "1 0 auto",
        justifyContent: "center",
        textAlign: "center",
        fontSize: "1rem"
      }}
    >
      <Table>
        <thead>
          <tr
            style={{
              fontWeight: "bold"
            }}
          >
            <th>#</th>
            <th>Name</th>
            <th>Voting Power</th>
            <th>Staking</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td> {moniker}</td>
            <td>{DecUtils.trim(votingPower)}</td>
            <td
              style={{
                display: "flex",
                justifyContent: "center"
              }}
            >
              <Button
                style={{
                  width: "0.75rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
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
            </td>
          </tr>
        </tbody>
      </Table>
      <Modal
        className={style.poolModal}
        isOpen={isModalOpen}
        toggle={toggleModal}
      >
        <ModalBody>
          <Card>
            <StakingModal
              validator={validator}
              requestModalClose={() => {
                setIsModalOpen(false);
              }}
            />
          </Card>
        </ModalBody>
      </Modal>
    </div>
  );
};

export const StakingModal: FunctionComponent<{
  validator: Validator;
  requestModalClose: () => void;
}> = observer(({ validator, requestModalClose }) => {
  const { accountStore } = useStore();

  const [amount, setAmount] = useState("");

  const [isSending, setIsSending] = useState(false);

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

    const precision = DecUtils.getPrecisionDec(stakingCurrency.coinDecimals);

    const amountDec = new Dec(amount).mulTruncate(precision);

    if (keys.length > 0) {
      const msg = new MsgDelegate(
        AccAddress.fromBech32(keys[0].bech32Address),
        ValAddress.fromBech32(validator.operator_address),
        new Coin(stakingCurrency.coinMinimalDenom, amountDec.truncate())
      );

      setIsSending(true);

      try {
        const result = (await cosmosJS.sendMsgs(
          [msg],
          { gas: "200000", memo: "", fee: [] },
          "commit"
        )) as any;

        if (result.status !== 200 || result.statusText !== "OK") {
          toast.error("Failed to stake");
        } else {
          const code = result.data.code;
          if (code) {
            toast.error("Failed to stake: " + result.data.raw_log);
          } else {
            toast("Success!");
          }
        }
      } catch {
        toast.error("Failed to stake");
      } finally {
        requestModalClose();
        setIsSending(false);
      }
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
            data-loading={isSending}
          >
            Send Staking
          </Button>
        </CardBody>
      </Card>
    </div>
  );
});
