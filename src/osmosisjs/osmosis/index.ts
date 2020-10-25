import { Api, ApiConfig, CoreConfig } from "@chainapsis/cosmosjs/core/api";
import { GaiaRest } from "@chainapsis/cosmosjs/gaia/rest";
import * as CmnCdc from "@chainapsis/cosmosjs/common/codec";
import * as Bank from "@chainapsis/cosmosjs/x/bank";
import * as Distribution from "@chainapsis/cosmosjs/x/distribution";
import * as Gov from "@chainapsis/cosmosjs/x/gov";
import * as Slashing from "@chainapsis/cosmosjs/x/slashing";
import * as Staking from "@chainapsis/cosmosjs/x/staking";
import * as Gamm from "../x/gamm";
import { defaultTxEncoder } from "@chainapsis/cosmosjs/common/stdTx";
import { stdTxBuilder } from "@chainapsis/cosmosjs/common/stdTxBuilder";
import { Context } from "@chainapsis/cosmosjs/core/context";
import { Account } from "@chainapsis/cosmosjs/core/account";
import { BIP44 } from "@chainapsis/cosmosjs/core/bip44";
import { defaultBech32Config } from "@chainapsis/cosmosjs/core/bech32Config";
import { Codec } from "@chainapsis/ts-amino";
import { queryAccount } from "@chainapsis/cosmosjs/core/query";
import * as Crypto from "@chainapsis/cosmosjs/crypto";

export class OsmosisApi extends Api<GaiaRest> {
  constructor(
    config: ApiConfig,
    coreConfig: Partial<CoreConfig<GaiaRest>> = {}
  ) {
    super(config, {
      ...{
        txEncoder: defaultTxEncoder,
        txBuilder: stdTxBuilder,
        restFactory: (context: Context) => {
          return new GaiaRest(context);
        },
        queryAccount: (
          context: Context,
          address: string | Uint8Array,
          isStargate: boolean
        ): Promise<Account> => {
          return queryAccount(
            context.get("rpcInstance"),
            address,
            coreConfig.bech32Config
              ? coreConfig.bech32Config.bech32PrefixAccAddr
              : "cosmos",
            {
              isStargate
            }
          );
        },
        bech32Config: defaultBech32Config("cosmos"),
        bip44: new BIP44(44, 118, 0),
        registerCodec: (codec: Codec) => {
          CmnCdc.registerCodec(codec);
          Crypto.registerCodec(codec);
          Bank.registerCodec(codec);
          Distribution.registerCodec(codec);
          Gov.registerCodec(codec);
          Slashing.registerCodec(codec);
          Staking.registerCodec(codec);
          Gamm.registerCodec(codec);
        }
      },
      ...coreConfig
    });

    this.isStargate = true;
  }
}
