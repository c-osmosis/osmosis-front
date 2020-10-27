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
  },
  {
    coinDenom: "ATOM from HUB",
    coinMinimalDenom:
      "ibc/6F4CBB9F6E71B5842970537C9C3AE9FB50361EEEED03CE2FC33F0FA4955D5938",
    coinDecimals: 6
  }
];

export const stakingCurrency: Currency = {
  coinDenom: "STAKE",
  coinMinimalDenom: "stake",
  coinDecimals: 6
};

export const chainInfo: ChainInfo = {
  rpc: "http://localhost:26657",
  rest: "http://localhost:1317",
  chainId: "osmosis-4",
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
