import { ChainInfo, Currency } from "./keplr";
import { defaultBech32Config } from "@chainapsis/cosmosjs/core/bech32Config";

export const currencies: Currency[] = [
  {
    coinDenom: "STAKE",
    coinMinimalDenom: "stake",
    coinDecimals: 6
  },
  {
    coinDenom: "OSMO",
    coinMinimalDenom: "uosmo",
    coinDecimals: 6
  }
];

export const chainInfo: ChainInfo = {
  rpc: "http://localhost:26657",
  rest: "http://localhost:1317",
  chainId: "test-1",
  chainName: "Osmosis",
  stakeCurrency: {
    coinDenom: "STAKE",
    coinMinimalDenom: "stake",
    coinDecimals: 6
  },
  bip44: {
    coinType: 118
  },
  bech32Config: defaultBech32Config("cosmos"),
  currencies: [
    {
      coinDenom: "STAKE",
      coinMinimalDenom: "stake",
      coinDecimals: 6
    },
    {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6
    }
  ],
  feeCurrencies: [
    {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6
    }
  ],
  features: ["stargate"]
};
