import { Connection } from "@solana/web3.js";
import { config } from "./config";

class ConnectionManager {
  private static conn: Connection;

  private constructor() {} // prevent new instantiation of the ConnectionManager

  static getConnectionInstance(): Connection {
    if (!ConnectionManager.conn) {
      ConnectionManager.conn = new Connection(
        config.rpcUrl,
        "finalized",
      );
      console.log("Devnet connection established!");
    }
    return ConnectionManager.conn;
  }
}

export const connection = ConnectionManager.getConnectionInstance();