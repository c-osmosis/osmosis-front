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
            <a href="https://github.com/c-osmosis/osmosis" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  style={{ fill: "white" }}
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>
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
