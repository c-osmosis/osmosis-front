import { Amino, Type } from "@chainapsis/ts-amino";
import { Msg } from "@chainapsis/cosmosjs/core/tx";
import { AccAddress } from "@chainapsis/cosmosjs/common/address";
import { Coin } from "@chainapsis/cosmosjs/common/coin";
import bigInteger from "big-integer";
import { Int } from "@chainapsis/cosmosjs/common/int";

const { Field, DefineStruct } = Amino;

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

@DefineStruct()
export class MaxAmountIn {
  @Field.String(0)
  public denom: string;

  @Field.Defined(1)
  public maxAmount: Int;

  constructor(denom: string, maxAmount: Int) {
    this.denom = denom;
    this.maxAmount = maxAmount;
  }
}

@DefineStruct()
export class MsgJoinPool extends Msg {
  @Field.Defined(0)
  public sender: AccAddress;

  @Field.Uint64(1)
  public targetPoolId: bigInteger.BigInteger;

  @Field.Defined(2)
  public poolAmountOut: Int;

  @Field.Slice(3, {
    type: Type.Defined
  })
  public maxAmountsIn: MaxAmountIn[];

  constructor(
    sender: AccAddress,
    targetPoolId: bigInteger.BigNumber,
    poolAmountOut: Int,
    maxAmountsIn: MaxAmountIn[]
  ) {
    super();

    this.sender = sender;
    this.targetPoolId = bigInteger(targetPoolId as any);
    this.poolAmountOut = poolAmountOut;
    this.maxAmountsIn = maxAmountsIn;
  }

  public getSigners(): AccAddress[] {
    return [this.sender];
  }

  public validateBasic(): void {
    // TODO
  }
}
