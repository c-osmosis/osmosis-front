export interface Pool {
  // uint64
  id: string;
  // dec
  swapFee: string;
  // uint64
  totalWeight: string;
  token: {
    // Ex: osmosis/pool/0
    denom: string;
    description: string;
    // uint64
    totalSupply: string;
  };
  records: {
    [denom: string]: {
      // dec
      denormalizedWeight: string;
      // sdk.int
      balance: string;
    };
  };
}
