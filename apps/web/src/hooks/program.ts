import { Program, AnchorProvider, type Idl } from "@coral-xyz/anchor";
import idl from "../../../../target/idl/dumbfun.json";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";

export const useProgram = () => {
  const wallet = useAnchorWallet();
  if (!wallet) {
    console.log("Wallet is undefined!");
    return;
  }
  const connection = useConnection().connection;
  console.log(connection.rpcEndpoint);

  const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions(),
    );

  const program = new Program(idl as Idl, provider);

  return { program };
};
