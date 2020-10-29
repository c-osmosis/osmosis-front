import { ChainInfo, Currency } from "./keplr";
import { defaultBech32Config } from "@chainapsis/cosmosjs/core/bech32Config";

export const currencies: Currency[] = [
  {
    coinDenom: "OSMO",
    coinMinimalDenom: "uosmo",
    coinDecimals: 6
  },
  {
    coinDenom: "IRIS",
    coinMinimalDenom: "uiris",
    coinDecimals: 6
  },
  {
    coinDenom: "DAI",
    coinMinimalDenom: "udai",
    coinDecimals: 6
  },
  {
    coinDenom: "ATOM from HUB",
    coinMinimalDenom:
      "ibc/80A5BCB9B282BEED21DC25B647A1D5A6B7E1033052E598265B8DC780D9326F4F",
    coinDecimals: 6
  }
];

export const stakingCurrency: Currency = {
  coinDenom: "LP",
  coinMinimalDenom: "osmosis/pool/1",
  coinDecimals: 6
};

export const chainInfo: ChainInfo = {
  rpc: "http://35.236.124.69:26657",
  rest: "http://35.236.124.69:1317",
  chainId: "osmosis-4",
  chainName: "Osmosis",
  stakeCurrency: stakingCurrency,
  bip44: {
    coinType: 118
  },
  bech32Config: defaultBech32Config("cosmos"),
  currencies: currencies,
  feeCurrencies: [
    {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6
    }
  ],
  features: ["stargate"]
};

export const faucetURL = "http://35.236.124.69:8000";
