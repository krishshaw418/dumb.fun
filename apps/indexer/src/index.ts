import "dotenv/config";
import { PublicKey } from "@solana/web3.js";
import { program } from "./program";
import Client, {
  SubscribeRequest,
  CommitmentLevel,
} from "@triton-one/yellowstone-grpc";
import bs58 from "bs58";

async function main() {
  const programId = new PublicKey(program.programId);
  const client = new Client("http://127.0.0.1:10000", "", {});
  await client.connect();
  console.log("Connected to local validator!");

  const stream = await client.subscribe();

  stream.on("data", (data) => {
    // console.log("data:", data);
    if (data.transaction) {
      const sigBuf: Buffer = data.transaction.transaction.signature;
      if (sigBuf) {
        const sigBase58 = bs58.encode(sigBuf);
        console.log("Txn sig: ", sigBase58);
      } else {
        console.log("data:", data);
      }
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
  })

}

main().catch((error) => {
  console.error("Error: ", error);
  process.exit(1);
});
