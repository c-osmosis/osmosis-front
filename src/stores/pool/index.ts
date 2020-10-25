import { Pool } from "../../types";
import { action, observable } from "mobx";
import { actionAsync, task } from "mobx-utils";

import Axios from "axios";
import { chainInfo } from "../../config";

export class PoolStore {
  @observable
  public pools!: Pool[];

  constructor() {
    this.init();
  }

  @action
  private init() {
    this.pools = [];

    this.fetchAllPools();
  }

  @actionAsync
  public async fetchAllPools() {
    const restInstance = Axios.create({
      baseURL: chainInfo.rest
    });

    const resultPools = await task(
      restInstance.get<{
        pools: Pool[];
      }>("/osmosis/gamm/v1beta1/pools/all")
    );

    // TODO: handle error.

    if (resultPools.status === 200) {
      this.pools = resultPools.data.pools;
    }
  }

  public getAvailablePools(
    tokenInDenom: string,
    tokenOutDenom: string
  ): Pool[] {
    return this.pools.filter(pool => {
      const poolDenoms = Object.keys(pool.records);
      return (
        poolDenoms.indexOf(tokenInDenom) >= 0 &&
        poolDenoms.indexOf(tokenOutDenom) >= 0
      );
    });
  }
}
