import { PublicKey } from "@solana/web3.js";
import { Subscriber } from "./subscriber";
import { program } from "./program";
import "dotenv/config";

async function main() {
  const programId = new PublicKey(program.programId);
  const subscriber = new Subscriber(programId);

  console.log("Subscription Id: ", subscriber.getSubscriptionId());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
