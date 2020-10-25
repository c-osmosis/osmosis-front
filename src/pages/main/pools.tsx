import React, { FunctionComponent, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useStore } from "../../stores";
import { ListGroup, ListGroupItem } from "reactstrap";
import { Dec } from "@chainapsis/cosmosjs/common/decimal";

export const PoolsInfo: FunctionComponent<{
  tokenInDenom: string;
  tokenOutDenom: string;
  onPoolSelected: (id: string) => void;
}> = observer(({ tokenInDenom, tokenOutDenom, onPoolSelected }) => {
  const { poolStore } = useStore();

  const [selectedPoolId, _setSelectedPoolId] = useState("");

  const setSelectedPoolId = (id: string) => {
    _setSelectedPoolId(id);

    onPoolSelected(id);
  };

  useEffect(() => {
    if (!tokenInDenom || !tokenOutDenom) {
      setSelectedPoolId("");
    }
  }, [tokenInDenom, tokenOutDenom]);

  return (
    <div>
      <ListGroup>
        {poolStore
          .getAvailablePools(
            tokenInDenom || "unknown",
            tokenOutDenom || "unknown"
          )
          .map((pool, i) => {
            return (
              <ListGroupItem
                key={i.toString()}
                tag="button"
                active={pool.id === selectedPoolId}
                onClick={e => {
                  e.preventDefault();

                  setSelectedPoolId(pool.id);
                }}
              >
                Fee: {new Dec(pool.swapFee).toString(2)}%
              </ListGroupItem>
            );
          })}
      </ListGroup>
    </div>
  );
});
