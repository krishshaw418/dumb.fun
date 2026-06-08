import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import type { Dumbfun } from "../target/types/dumbfun";
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
import { BN } from "bn.js";


describe("program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Dumbfun as Program<Dumbfun>
  const user = provider.wallet;

  it("Initialize bonding curve", async () => {

    // 1. Creating a dummy mint
    const mint = await createMint(
      provider.connection,
      user.payer as anchor.web3.Signer,
      user.publicKey,
      null,
      6
    );

    // 4. update db
    const createdAt = Date.now();
    try {
      const response = await fetch("http://localhost:8080/api/new-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mint: mint.toString(),
          creator: user.publicKey.toString(),
          name: "test-coin",
          symbol: "tstc",
          url: "https://api.s3.us-east.amazonaws.com",
          createdAt: new Date(createdAt)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error: any) {
      assert.fail(error);
    }

    // 5. Derive the pda
    const [bondingCurvePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bonding_curve"), mint.toBuffer()],
      program.programId
    )

    // 6. Call initialize
    const k = new BN(2);
    const base_price = new BN(10);
    await program.methods
      .initialize(k, base_price)
      .accounts({
        user: user.publicKey,
        mint,
      })
      .rpc();
    
    // 7. Fetch and assert state
    const account = await program.account.bondingCurve.fetch(
      bondingCurvePda
    );

    console.log("Bonding Curve:", account);

    // Assertions
    if (!account.mint.equals(mint)) {
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
      user.payer as anchor.web3.Signer,
      user.publicKey,
      null,
      6
    );

    // 2. update db
    const createdAt = Date.now();
    try {
      const response = await fetch("http://localhost:8080/api/new-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mint: mint.toString(),
          creator: user.publicKey.toString(),
          name: "test-coin",
          symbol: "tstc",
          url: "https://api.s3.us-east.amazonaws.com",
          createdAt: new Date(createdAt)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error: any) {
      assert.fail(error);
    }

    // 3. Derive PDA
    const [bondingCurvePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("bonding_curve"), mint.toBuffer()],
      program.programId
    );

    // 4. Initialize bonding curve
    await program.methods
      .initialize(new BN(1), new BN(10)) // k=1, base=10
      .accounts({
        user: user.publicKey,
        mint,
      })
      .rpc()
    
    // 5. Set mint authority
    await setAuthority(
      provider.connection,
      user.payer as anchor.web3.Signer,
      mint,
      user.publicKey,
      AuthorityType.MintTokens,
      bondingCurvePda
    );

    // 6. Create user ata
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user.payer as anchor.web3.Signer,
      mint,
      user.publicKey
    );

    // 7. Calling buy instruction
    const solAmount = new BN(100); // lamports
    const minTokensOut = new BN(1);

    await program.methods
      .buy(solAmount, minTokensOut)
      .accounts({
        user: user.publicKey,
        mint: mint,
        userTokenAccount: userTokenAccount.address,
        mintAccount: mint
      })
      .rpc();

    // 8. Fetch state
    const curve = await program.account.bondingCurve.fetch(bondingCurvePda);


    // 9. Assertions
    // Price = base + k*supply = 10 + 1*0 = 10
    // tokens_out = 100 / 10 = 10

    assert.equal(curve.supply.toNumber(), 10);
    assert.equal(curve.reserve.toNumber(), 100);


    // 10. Check user's balance
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
      user.payer as anchor.web3.Signer,
      user.publicKey,
      null,
      0
    );

    console.log("mint created: ", mint.toString());
    console.log("creator of mint: ", user.publicKey.toString());
    
    // 2. update db
    const createdAt = Date.now();
    try {
      const response = await fetch("http://localhost:8080/api/new-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mint: mint.toString(),
          creator: user.publicKey.toString(),
          name: "test-coin",
          symbol: "tstc",
          url: "https://api.s3.us-east.amazonaws.com",
          createdAt: new Date(createdAt)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error: any) {
      assert.fail(error);
    }

    // 3. Derive PDA
    const [bondingCurvePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("bonding_curve"), mint.toBuffer()],
      program.programId
    );

    // 4. Initialize
    await program.methods
      .initialize(new BN(1), new BN(10))
      .accounts({
        user: user.publicKey,
        mint,
      })
      .rpc();

    // 5. Set mint authority → PDA
    await setAuthority(
      provider.connection,
      user.payer as anchor.web3.Signer,
      mint,
      user.publicKey,
      AuthorityType.MintTokens,
      bondingCurvePda
    );

    // 6. Create ATA
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      user.payer as anchor.web3.Signer,
      mint,
      user.publicKey
    );

    // 7. BUY first (setup state)
    await program.methods
      .buy(new BN(100), new BN(1))
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
    console.log("Token balance of user after buy:", balance.value.amount);

    const Curve = await program.account.bondingCurve.fetch(bondingCurvePda);
    console.log("Reserve balance after minting tokens to user:", Curve.reserve.toString());

    // After buy:
    // price = 10
    // tokens_out = 100 / 10 = 10
    // supply = 10
    // reserve = 100
    
    // 8. SELL
    const sellAmount = new BN(5);

    await program.methods
      .sell(sellAmount)
      .accounts({
        user: user.publicKey,
        mint: mint,
        userTokenAccount: userTokenAccount.address,
        mintAccount: mint,
      })
      .rpc();

    // 9. Fetch state
    const curve = await program.account.bondingCurve.fetch(bondingCurvePda);

    // 10. Assertions

    // After sell:
    assert.equal(curve.supply.toNumber(), 5);
    assert.equal(curve.reserve.toNumber(), 25);

    // 11. Check token balance
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
