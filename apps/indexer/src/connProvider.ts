import { Connection } from "@solana/web3.js";
import "dotenv/config";

if (!process.env.ANCHOR_PROVIDER_URL) {
  throw new Error("Failed to load env variables!");
}

class ConnectionManager {
  private static conn: Connection;

  private constructor() {} // prevent new instantiation of the ConnectionManager

  static getConnectionInstance(): Connection {
    if (!ConnectionManager.conn) {
      ConnectionManager.conn = new Connection(
        process.env.ANCHOR_PROVIDER_URL!,
        "finalized",
      );
      console.log("Devnet connection established!");
    }
    return ConnectionManager.conn;
  }
}

export const connection = ConnectionManager.getConnectionInstance();