import { Codec } from "@chainapsis/ts-amino";
import { MsgSwapExactAmountIn } from "./msgs";

export function registerCodec(codec: Codec) {
  codec.registerConcrete(
    "osmosis/gamm/swap-exact-amount-in",
    MsgSwapExactAmountIn.prototype
  );
}
