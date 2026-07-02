import { Program, AnchorProvider, type Idl } from "@coral-xyz/anchor";
import idl from "../../../../target/idl/dumbfun.json";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export const useProgram = () => {
  const wallet = useAnchorWallet();
  const connection = useConnection().connection;

  const program = useMemo(() => {
    if (!wallet) {
      console.log("Wallet is undefined!");
      return;
    }

    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions(),
    );

    return new Program(idl as Idl, provider);
  }, [wallet, connection]);

  return { program };
};
