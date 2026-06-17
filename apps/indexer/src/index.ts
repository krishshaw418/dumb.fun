import { PublicKey } from "@solana/web3.js";
import { program } from "./program";
import { client } from "./grpc-client";
import {
  SubscribeRequest,
  CommitmentLevel,
} from "@triton-one/yellowstone-grpc";
import { decodeInstructionData, decodeInstructionMeta, backfillData } from "./utils";

async function main() {
  const programId = new PublicKey(program.programId);
  await client.connect();
  console.log("Connected to local validator!");

  // backfill missed data
  await backfillData();

  const stream = await client.subscribe();

  stream.on("data", async (data) => {
    // console.log(data);
    if (data.transaction) {
      // decodeInstructionData(data);
      await decodeInstructionMeta(data);
    }
  });

  const request: SubscribeRequest = {
    slots: {},
    accounts: {},
    transactions: {
      dumbfun: {
        vote: false,
        failed: false,
        accountInclude: [programId.toBase58()],
        accountExclude: [],
        accountRequired: [],
      },
    },
    transactionsStatus: {},
    blocks: {},
    blocksMeta: {},
    entry: {},
    accountsDataSlice: [],
    commitment: CommitmentLevel.FINALIZED,
  };

  stream.write(request);

  stream.on("error", (err) => {
    console.error(err);
  });

  stream.on("close", () => {
    console.log("Connection closed!");
  });
}

main().catch((error) => {
  console.error("Error: ", error);
  process.exit(1);
});
