import React, { FunctionComponent } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../stores";

export const PoolsInfo: FunctionComponent = observer(() => {
  const { poolStore } = useStore();

  return (
    <div>
      {poolStore.pools.map((pool, i) => {
        return <div key={i.toString()}>{pool.id}</div>;
      })}
    </div>
  );
});
