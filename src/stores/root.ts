import { AccountStore } from "./account";
import { PoolStore } from "./pool";
import { ValidatorStore } from "./validator";

export class RootStore {
  public readonly accountStore: AccountStore;
  public readonly poolStore: PoolStore;
  public readonly validatorStore: ValidatorStore;

  constructor() {
    this.accountStore = new AccountStore(this);
    this.poolStore = new PoolStore();
    this.validatorStore = new ValidatorStore();

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
