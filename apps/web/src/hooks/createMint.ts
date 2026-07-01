import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
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
      SystemProgram.createAccount({ // To create a new account owned by the system account
        fromPubkey: wallet.publicKey!,
        newAccountPubkey: mint.publicKey,
        lamports: mintRent,
        space: MINT_SIZE,
        programId: TOKEN_2022_PROGRAM_ID, // The ownership is transfered to the Token 2022 Program after account is created
      }),
      createInitializeMintInstruction( // To initialize the newly created acc as the new Mint
        mint.publicKey,
        6,
        wallet.publicKey!,
        wallet.publicKey!,
        TOKEN_2022_PROGRAM_ID,
      ),
    );

    try {
      const signature = await wallet.sendTransaction(transaction, connection, {
        signers: [mint],
      });
      console.log(signature);
      if (!signature) {
        throw new Error("Failed to send txn!");
      }
      console.log("New token mint: ", mint.publicKey.toBase58());
      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          signature: signature,
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        },
        "confirmed",
      );

      return { signature, mint };
    } catch (error) {
      throw error;
    }
  };
  return { initMint };
}
