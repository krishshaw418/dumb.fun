import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
} from "@solana/spl-token";

export function useCreateMint() {
  const wallet = useWallet();
  const connection = useConnection().connection;

  const initMint = async () => {
    if (!wallet.publicKey) {
      return;
    }
    const mint = Keypair.generate();

    const mintRent = await connection.getMinimumBalanceForRentExemption(
      MINT_SIZE,
      "confirmed",
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey!,
        newAccountPubkey: mint.publicKey,
        lamports: mintRent,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint.publicKey,
        6,
        wallet.publicKey!,
        wallet.publicKey!,
        TOKEN_PROGRAM_ID,
      ),
    );

    if (!wallet.signTransaction) {
      return;
    }

    try {
      const signature = await wallet.sendTransaction(transaction, connection, {
        signers: [mint],
      });
      console.log(signature);
      if (!signature) {
        throw new Error("Failed to send txn!");
      }
      return { signature, mint };
    } catch (error) {
      throw error;
    }
  };
  return { initMint };
}
