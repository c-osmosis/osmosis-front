import { AccountStore } from "./account";
import { PoolStore } from "./pool";

export class RootStore {
  public readonly accountStore: AccountStore;
  public readonly poolStore: PoolStore;

  constructor() {
    this.accountStore = new AccountStore(this);
    this.poolStore = new PoolStore();

    addEventListener("load", () => {
      // Try to sign in to wallet after load
      this.accountStore.signInToWallet();
    });
  }

  accountLoaded() {}
}

export function createRootStore() {
  return new RootStore();
}
