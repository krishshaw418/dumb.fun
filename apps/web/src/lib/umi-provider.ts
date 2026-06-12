import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

function useUmi() {
  const conCtx = useConnection();
  const wallet = useWallet();
  const umi = createUmi(conCtx.connection.rpcEndpoint, "confirmed");
  umi.use(walletAdapterIdentity(wallet));
  umi.use(mplTokenMetadata());

  return { umi };
}

export default useUmi;
