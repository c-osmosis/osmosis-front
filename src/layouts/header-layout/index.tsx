import React, { FunctionComponent, useState } from "react";

import { Button, Container, Navbar, NavbarBrand } from "reactstrap";
import { observer } from "mobx-react";
import { useStore } from "../../stores";

import style from "./style.module.scss";

import classnames from "classnames";
import Axios from "axios";
import { chainInfo, faucetURL } from "../../config";
import { toast } from "react-toastify";

export const HeaderLayout: FunctionComponent = observer(props => {
  const { children } = props;

  const { accountStore } = useStore();

  const [isRequestingFaucet, setIsRequestingFaucet] = useState(false);

  const requestFaucet = async () => {
    const instance = Axios.create({
      baseURL: faucetURL
    });

    setIsRequestingFaucet(true);

    try {
      const result = await instance.post("", {
        address: accountStore.bech32Address,
        "chain-id": chainInfo.chainId
      });

      if (
        result.status === 200 ||
        result.status === 201 ||
        result.status === 202
      ) {
        toast("Succeed to request some assets from faucet");
      } else {
        toast.error("Failed to request some assets from faucet");
      }
    } catch (e) {
      console.log(e);
      if (e.response?.data?.error) {
        toast.error(
          `Failed to request some assets from faucet: ${e.response.data.error}`
        );
      } else {
        toast.error("Failed to request some assets from faucet");
      }
    } finally {
      setIsRequestingFaucet(false);
    }
  };

  return (
    <div>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          overflow: "hidden"
        }}
      >
        <div className={classnames(style.squares, style.square1)} />
        <div className={classnames(style.squares, style.square2)} />
        <div className={classnames(style.squares, style.square3)} />
        <div className={classnames(style.squares, style.square4)} />
        <div className={classnames(style.squares, style.square5)} />
        <div className={classnames(style.squares, style.square6)} />
        <div className={classnames(style.squares, style.square7)} />
      </div>
      <Navbar
        expand="lg"
        color="transparent"
        style={{
          minHeight: "4rem"
        }}
      >
        <Container>
          <NavbarBrand href="/">
            <img
              src={require("../../assets/osmo_logo.png")}
              height={40}
              width={130}
            />
          </NavbarBrand>
          <div>
            <Button
              color="success"
              disabled={!accountStore.bech32Address}
              data-loading={isRequestingFaucet}
              onClick={async e => {
                e.preventDefault();

                await requestFaucet();
              }}
            >
              Faucet
            </Button>
            {accountStore.bech32Address}
          </div>
        </Container>
      </Navbar>
      <div>{children}</div>
    </div>
  );
});
