import { observable } from "mobx";

import { GaiaApi } from "@chainapsis/cosmosjs/gaia/api";

import { actionAsync, task } from "mobx-utils";
import { chainInfo } from "../../config";
import { RootStore } from "../root";

export class AccountStore {
  @observable public bech32Address!: string;

  constructor(private readonly rootStore: RootStore) {}

  @actionAsync
  public async signInToWallet() {
    if (!window.cosmosJSWalletProvider) {
      throw new Error("there is no wallet provider");
    }

    if (!window.keplr?.experimentalSuggestChain) {
      throw new Error("please use the latest version of keplr");
    }

    await task(window.keplr.experimentalSuggestChain(chainInfo));

    const cosmosJS = new GaiaApi({
      chainId: chainInfo.chainId,
      rpc: chainInfo.rpc,
      rest: chainInfo.rest,
      walletProvider: window.cosmosJSWalletProvider
    });

    await task(cosmosJS.enable());

    const keys = await task(cosmosJS.getKeys());

    if (keys.length === 0) {
      throw new Error("there is no key");
    }

    // Only use the first key.
    this.bech32Address = keys[0].bech32Address;

    this.rootStore.accountLoaded();
  }
}
