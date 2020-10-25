import { Codec } from "@chainapsis/ts-amino";
import { MsgSwapExactAmountIn, MsgJoinPool } from "./msgs";

export function registerCodec(codec: Codec) {
  codec.registerConcrete(
    "osmosis/gamm/swap-exact-amount-in",
    MsgSwapExactAmountIn.prototype
  );
  codec.registerConcrete("osmosis/gamm/join-pool", MsgJoinPool.prototype);
}
