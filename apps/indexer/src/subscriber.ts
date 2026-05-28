import { connection } from "./connProvider";
import { PublicKey } from "@solana/web3.js";
import { parser } from "./program";
import { prisma } from "db";

export class Subscriber {
  pubKey: PublicKey;

  constructor(pubKey: PublicKey) {
    this.pubKey = pubKey;
  }

  getSubscriptionId() {
    const subscriptionId = connection.onLogs(
      this.pubKey,
      async (logInfo) => {
        for (const event of parser.parseLogs(logInfo.logs)) {
          console.log(event.name);
          console.log(event.data);
        }
      },
      "finalized",
    );

    return subscriptionId;
  }
}
