import { useEffect, useMemo, useState } from "react";
import { PoolStore } from "../../stores/pool";

export const useSelectPool = (
  poolStore: PoolStore,
  tokenInDenom: string,
  tokenOutDenom: string
) => {
  const [poolId, setPoolId] = useState("");

  useEffect(() => {
    if (!tokenInDenom || !tokenOutDenom) {
      setPoolId("");
    }
  }, [tokenInDenom, tokenOutDenom]);

  const pools = useMemo(
    () =>
      poolStore.getAvailablePools(
        tokenInDenom || "unknown",
        tokenOutDenom || "unknown"
      ),
    [poolStore.pools, tokenInDenom, tokenOutDenom]
  );

  useEffect(() => {
    if (pools.length > 0) {
      setPoolId(pools[0].id);
    }
  }, [pools]);

  return {
    poolId
  };
};
