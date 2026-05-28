import "dotenv/config";
// import { PublicKey } from "@solana/web3.js";
// import { Subscriber } from "./subscriber";
// import { program } from "./program";
import Client, { SubscribeRequest, CommitmentLevel } from "@triton-one/yellowstone-grpc";

async function main() {
  // const programId = new PublicKey(program.programId);

  const client = new Client("http://localhost:10000", "", {});

  await client.connect();

  const stream = await client.subscribe();

  stream.on("error", (err) => {
    throw err;
  });
  
  stream.on("data", (data) => {
    console.log(data);
  });

  const request: SubscribeRequest = {
    slots: {},
    accounts: {},
    transactionsStatus: {},
    transactions: {
      client: {
        accountInclude: ["5Xa2CjDwCgoY9vTWShUxAb7AyCgdKUa8xXaFuv25QFex"],
        accountExclude: [],
        accountRequired: []
      }
    },
    blocks: {},
    blocksMeta: {},
    entry: {},
    accountsDataSlice: [],
    commitment: CommitmentLevel.PROCESSED
  };

  stream.write(request);

  stream.on("end", () => {
    console.log("Stream ended!")
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
