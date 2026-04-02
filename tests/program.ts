import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Dumbfun } from "../target/types/dumbfun";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  setAuthority,
  AuthorityType
} from "@solana/spl-token";
import { strict as assert } from "assert";


describe("program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Dumbfun as Program<Dumbfun>
  const user = provider.wallet;

  it("Initialize bonding curve", async () => {

    // 1. Creating a dummy mint
    const mint = Keypair.generate();
    
    // 2. Airdroping some SOL to sign transaction
    const sig = await provider.connection.requestAirdrop(
      user.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );

    const latestBlockHash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: sig
    }, 'confirmed');

    // 3. Create mint account (just a system account is fine for seed usage)
    const lamports = await provider.connection.getMinimumBalanceForRentExemption(0);
    
    const createMintTx = new anchor.web3.Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: user.publicKey,
        newAccountPubkey: mint.publicKey,
        space: 0,
        lamports,
        programId: SystemProgram.programId,
      })
    );
    await provider.sendAndConfirm(createMintTx, [mint]);

    // 4. Derive the pda
    const [bondingCurvePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bonding_curve"), mint.publicKey.toBuffer()],
      program.programId
    )

    // 5. Call initialize
    const k = new anchor.BN(2);
    const base_price = new anchor.BN(10);
    await program.methods
      .initialize(k, base_price)
      .accounts({
        user: user.publicKey,
        mint: mint.publicKey,
      })
      .rpc();
    
    // 6. Fetch and assert state
    const account = await program.account.bondingCurve.fetch(
      bondingCurvePda
    );

    console.log("Bonding Curve:", account);

    // Assertions
    if (!account.mint.equals(mint.publicKey)) {
      throw new Error("Mint mismatch");
    }

    if (!account.creator.equals(user.publicKey)) {
      throw new Error("Creator mismatch");
    }

    if (account.k.toNumber() !== 2) {
      throw new Error("k not set correctly");
    }

    if (account.basePrice.toNumber() !== 10) {
      throw new Error("Base price not set correctly");
    }

    if (account.supply.toNumber() !== 0) {
      console.log(account.supply);
      throw new Error("Initial supply should be 0");
    }

    if (account.reserve.toNumber() !== 0) {
      throw new Error("Initial reserve should be 0");
    }

    if (account.isMigrated !== false) {
      throw new Error("isMigrated should be false");
    }
  });

  it("Buy tokens", async () => {

    // 1. Create a mint
    const mint = await createMint(
      provider.connection,
      user.payer,
      user.publicKey,
      null,
      6
    )

    // 2. Derive PDA
    const [bondingCurvePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("bonding_curve"), mint.toBuffer()],
      program.programId
    );

    // 3. Initialize bonding curve
    await program.methods
      .initialize(new anchor.BN(1), new anchor.BN(10)) // k=1, base=10
      .accounts({
        user: user.publicKey,
        mint,
      })
      .rpc()
    
    // 4. Set mint authority
    await setAuthority(
      provider.connection,
      user.payer,
      mint,
      user.publicKey,
      AuthorityType.MintTokens,
      bondingCurvePda
    );

    // 5. Create user ata
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user.payer,
      mint,
      user.publicKey
    );

    // 6. Calling buy instruction
    const solAmount = new anchor.BN(100); // lamports
    const minTokensOut = new anchor.BN(1);

    await program.methods
      .buy(solAmount, minTokensOut)
      .accounts({
        user: user.publicKey,
        mint: mint,
        userTokenAccount: userTokenAccount.address,
        mintAccount: mint
      })
      .rpc();

    // 7. Fetch state
    const curve = await program.account.bondingCurve.fetch(bondingCurvePda);


    // 8. Assertions
    // Price = base + k*supply = 10 + 1*0 = 10
    // tokens_out = 100 / 10 = 10

    assert.equal(curve.supply.toNumber(), 10);
    assert.equal(curve.reserve.toNumber(), 100);


    // 9. Check user's balance
    const balance = await provider.connection.getTokenAccountBalance(
      userTokenAccount.address
    );

    assert.equal(Number(balance.value.amount), 10);

    console.log("Buy successful:", {
      supply: curve.supply.toNumber(),
      reserve: curve.reserve.toNumber(),
    });
    
  });

  it("Sell tokens", async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Dumbfun as Program<Dumbfun>;
  const user = provider.wallet;

  // 1. Create mint (0 decimals)
  const mint = await createMint(
    provider.connection,
    user.payer,
    user.publicKey,
    null,
    0
  );

  // 2. Derive PDA
  const [bondingCurvePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("bonding_curve"), mint.toBuffer()],
    program.programId
  );

  // 3. Initialize
  await program.methods
    .initialize(new anchor.BN(1), new anchor.BN(10))
    .accounts({
      user: user.publicKey,
      mint,
    })
    .rpc();

  // 4. Set mint authority → PDA

  await setAuthority(
    provider.connection,
    user.payer,
    mint,
    user.publicKey,
    AuthorityType.MintTokens,
    bondingCurvePda
  );

  // 5. Create ATA
  const userTokenAccount = await getOrCreateAssociatedTokenAccount(
    provider.connection,
    user.payer,
    mint,
    user.publicKey
  );

  // 6. BUY first (setup state)
  await program.methods
    .buy(new anchor.BN(100), new anchor.BN(1))
    .accounts({
      user: user.publicKey,
      mint: mint,
      userTokenAccount: userTokenAccount.address,
      mintAccount: mint
    })
    .rpc();

    console.log("User ATA:", userTokenAccount.address.toBase58());

const balance = await provider.connection.getTokenAccountBalance(
  userTokenAccount.address
);
console.log("Token balance:", balance.value.amount);

const Curve = await program.account.bondingCurve.fetch(bondingCurvePda);
console.log("Reserve:", Curve.reserve.toString());

  // After buy:
  // price = 10
  // tokens_out = 100 / 10 = 10
  // supply = 10
  // reserve = 100
  
  // 7. SELL
  const sellAmount = new anchor.BN(5);

  await program.methods
    .sell(sellAmount)
    .accounts({
      user: user.publicKey,
      mint: mint,
      userTokenAccount: userTokenAccount.address,
      mintAccount: mint,
    })
    .rpc();

  // 8. Fetch state
  const curve = await program.account.bondingCurve.fetch(bondingCurvePda);

  // 9. Assertions

  // After sell:
  assert.equal(curve.supply.toNumber(), 5);
  assert.equal(curve.reserve.toNumber(), 25);

  // 10. Check token balance
  const tokenBalance = await provider.connection.getTokenAccountBalance(
    userTokenAccount.address
  );

  assert.equal(Number(tokenBalance.value.amount), 5);

  console.log("Sell successful:", {
    supply: curve.supply.toNumber(),
    reserve: curve.reserve.toNumber(),
  });
});
});
