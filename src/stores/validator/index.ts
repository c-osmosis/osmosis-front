import { Validator } from "./types";
import { action, observable } from "mobx";
import { actionAsync, task } from "mobx-utils";

import Axios from "axios";
import { chainInfo } from "../../config";

export class ValidatorStore {
  @observable
  public validators!: Validator[];

  constructor() {
    this.init();
  }

  @action
  private init() {
    this.validators = [];

    this.fetchAllValidators();
  }

  @actionAsync
  public async fetchAllValidators() {
    const restInstance = Axios.create({
      baseURL: chainInfo.rest
    });

    const resultValidators = await task(
      restInstance.get<{
        validators: Validator[];
      }>("/cosmos/staking/v1beta1/validators")
    );

    if (resultValidators.status === 200) {
      this.validators = resultValidators.data.validators;
    }
  }
}
