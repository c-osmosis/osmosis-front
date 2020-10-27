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
}> = ({ validator }) => {
  const validatorAddress = validator.operator_address;
  console.log("validatorAddress", validatorAddress);

  return (
    <div>
      <Card>
        <CardHeader>Staking</CardHeader>
        <CardBody>
          <FormGroup key="staking">
            <Label>Amount</Label>
            <Input type="number" value={0} />
          </FormGroup>
          <Button
            type="submit"
            block
            color="success"
            onClick={async e => {
              e.preventDefault();

              console.log("clicked");
            }}
          >
            Send Staking
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};
