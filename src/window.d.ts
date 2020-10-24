import { WalletProvider } from "@chainapsis/cosmosjs/core/walletProvider";
import { ChainInfo } from "./keplr";

declare global {
  interface Window {
    cosmosJSWalletProvider?: WalletProvider;
    keplr?: {
      experimentalSuggestChain(chainInfo: ChainInfo): Promise<void>;
    };
  }
}
