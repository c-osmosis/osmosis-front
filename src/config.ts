import { ChainInfo, Currency } from "./keplr";
import { defaultBech32Config } from "@chainapsis/cosmosjs/core/bech32Config";

export const currencies: Currency[] = [
  {
    coinDenom: "ATOM from HUB",
    coinMinimalDenom:
      "ibc/80A5BCB9B282BEED21DC25B647A1D5A6B7E1033052E598265B8DC780D9326F4F",
    coinDecimals: 6
  },
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
  }
];

export const lpCurrencies: Currency[] = [
  {
    coinDenom: "OPT",
    coinMinimalDenom: "osmosis/pool/1",
    coinDecimals: 6
  },
  {
    coinDenom: "OPT (Pool 2)",
    coinMinimalDenom: "osmosis/pool/2",
    coinDecimals: 6
  },
  {
    coinDenom: "OPT (Pool 3)",
    coinMinimalDenom: "osmosis/pool/3",
    coinDecimals: 6
  }
];

export const stakingCurrency: Currency = {
  coinDenom: "OPT",
  coinMinimalDenom: "osmosis/pool/1",
  coinDecimals: 6
};

export const chainInfo: ChainInfo = {
  rpc: "https://node.c-osmosis.com/rpc",
  rest: "https://node.c-osmosis.com/rest",
  chainId: "osmosis-4",
  chainName: "Osmosis",
  stakeCurrency: stakingCurrency,
  bip44: {
    coinType: 118
  },
  bech32Config: defaultBech32Config("cosmos"),
  currencies: [stakingCurrency].concat(lpCurrencies).concat(currencies),
  feeCurrencies: [
    {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6
    }
  ],
  features: ["stargate"]
};

export const faucetURL = "https://node.c-osmosis.com/faucet/";
