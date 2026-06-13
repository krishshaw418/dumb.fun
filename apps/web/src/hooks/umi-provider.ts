import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

export function useUmi() {
  const conCtx = useConnection();
  const wallet = useWallet();
  const umi = createUmi(conCtx.connection.rpcEndpoint, "confirmed");
  umi.use(walletAdapterIdentity(wallet)).use(irysUploader());

  console.log(umi.identity.publicKey);

  return { umi };
}
