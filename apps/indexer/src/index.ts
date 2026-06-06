import { config } from "./config";
import { PublicKey } from "@solana/web3.js";
import { program } from "./program";
import Client, {
  SubscribeRequest,
  CommitmentLevel,
} from "@triton-one/yellowstone-grpc";
import { decodeInstructionData, decodeInstructionMeta } from "./utils";

async function main() {
  const programId = new PublicKey(program.programId);
  const client = new Client(config.grpcUrl, "", {});
  await client.connect();
  console.log("Connected to local validator!");

  const stream = await client.subscribe();

  stream.on("data", (data) => {
    // console.log(data);
    if (data.transaction) {
      // decodeInstructionData(data);
      decodeInstructionMeta(data);
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
    commitment: CommitmentLevel.PROCESSED,
  };

  stream.write(request);

  stream.on("error", (err) => {
    console.log(err);
  });

  stream.on("close", () => {
    console.log("Connection closed!");
  });
}

main().catch((error) => {
  console.error("Error: ", error);
  process.exit(1);
});
