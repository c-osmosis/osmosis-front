import { Amino } from "@chainapsis/ts-amino";
const { Field, DefineStruct } = Amino;
import { Msg } from "@chainapsis/cosmosjs/core/tx";
import { AccAddress } from "@chainapsis/cosmosjs/common/address";
import { Coin } from "@chainapsis/cosmosjs/common/coin";
import bigInteger from "big-integer";
import { Int } from "@chainapsis/cosmosjs/common/int";

@DefineStruct()
export class MsgSwapExactAmountIn extends Msg {
  @Field.Defined(0)
  public sender: AccAddress;

  @Field.Uint64(1)
  public targetPoolId: bigInteger.BigInteger;

  @Field.Defined(2)
  public tokenIn: Coin;

  @Field.String(3)
  public tokenOutDenom: string;

  @Field.Defined(4)
  public minAmountOut: Int;

  @Field.Defined(5)
  public maxPrice: Int;

  constructor(
    sender: AccAddress,
    targetPoolId: bigInteger.BigNumber,
    tokenIn: Coin,
    tokenOutDenom: string,
    minAmountOut: Int,
    maxPrice: Int
  ) {
    super();
    this.sender = sender;
    this.targetPoolId = bigInteger(targetPoolId as any);
    this.tokenIn = tokenIn;
    this.tokenOutDenom = tokenOutDenom;
    this.minAmountOut = minAmountOut;
    this.maxPrice = maxPrice;
  }

  public getSigners(): AccAddress[] {
    return [this.sender];
  }

  public validateBasic(): void {
    // TODO
  }
}
