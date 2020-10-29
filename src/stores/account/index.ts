import { action, observable } from "mobx";

import { GaiaApi } from "@chainapsis/cosmosjs/gaia/api";

import { actionAsync, task } from "mobx-utils";
import { chainInfo } from "../../config";
import { RootStore } from "../root";
import { Coin } from "@chainapsis/cosmosjs/common/coin";
import Axios from "axios";

export class AccountStore {
  @observable public bech32Address!: string;

  @observable public assets!: Coin[];

  constructor(private readonly rootStore: RootStore) {
    this.init();
  }

  @action
  private init() {
    this.assets = [];
  }

  @actionAsync
  public async signInToWallet() {
    if (!window.cosmosJSWalletProvider) {
      alert("Please install the Keplr extension");
      return;
    }

    if (!window.keplr?.experimentalSuggestChain) {
      alert("Please use the latest version of Keplr extension");
      return;
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

    this.fetchAssets();
  }

  @actionAsync
  public async fetchAssets() {
    const restInstance = Axios.create({
      baseURL: chainInfo.rest
    });

    const result = await task(
      restInstance.get<{
        result: {
          denom: string;
          amount: string;
        }[];
      }>(`/bank/balances/${this.bech32Address}`)
    );

    if (result.status !== 200) {
      throw new Error(result.statusText);
    }

    const assets: Coin[] = [];

    for (const asset of result.data.result) {
      const coin = new Coin(asset.denom, asset.amount);
      assets.push(coin);
    }

    this.assets = assets;
  }
}
