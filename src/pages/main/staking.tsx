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
            <td>{votingPower}</td>
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
