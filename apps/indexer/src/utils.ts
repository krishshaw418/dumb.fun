import { BorshInstructionCoder, BorshCoder, Idl } from "@coral-xyz/anchor";
import idl from "../../../target/idl/dumbfun.json";
import {
  TokenCreatedEventData,
  TradeEventData,
  Direction,
} from "../../../packages/types/types";
import { prisma } from "db";
import { connection } from "./connProvider";
import { program } from "./program";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

const coder = new BorshInstructionCoder(idl as Idl);
const eventCoder = new BorshCoder(idl as Idl);

// filter instruction data
export const decodeInstructionData = (data: any) => {
  const instructionsDataBuf: Uint8Array<ArrayBufferLike> =
    data.transaction.transaction.transaction.message.instructions[0].data;
  if (instructionsDataBuf) {
    const decoded = coder.decode(Buffer.from(instructionsDataBuf));
    console.log("Decoded data: ", decoded);
  } else {
    console.log("data:", data);
  }
};

// Filter events
export const decodeInstructionMeta = async (data: any) => {
  let programLogs;
  let latestTxn;
  if (data.transaction.transaction) {
    programLogs = data.transaction?.transaction?.meta.logMessages;
    latestTxn = {
      sig: bs58.encode(Buffer.from(data.transaction?.transaction?.signature)),
      slot: BigInt(data.transaction?.slot),
    };
  }

  if (!programLogs || !latestTxn) {
    programLogs = data.meta.logMessages;
    latestTxn = {
      sig: data.transaction.signatures[0],
      slot: BigInt(data.slot),
    };
  }

  console.log("From decodeInstructionMeta:", latestTxn);

  if (!programLogs) {
    console.log("No program logs found!");
    return;
  }
  for (const log of programLogs) {
    if (log.includes("Program data: ")) {
      const base64Str: string = log.split("Program data: ")[1];

      try {
        const event = eventCoder.events.decode(base64Str);
        // console.log(`Event: ${event?.name}\n`);
        // console.log(`Event Data: `, event?.data);
        if (event === null) {
          console.error("Event is null!");
          return;
        }
        await processAndSaveData({
          eventName: event.name,
          eventData: event.data,
          latestTxn: latestTxn,
        });
      } catch (error) {
        console.error(error);
        return;
      }
    }
  }
};

// process and save data
export const processAndSaveData = async (data: {
  eventName: string;
  eventData: any;
  latestTxn: {
    sig: string;
    slot: bigint;
  };
}) => {
  let dataStructure: TokenCreatedEventData | TradeEventData;

  switch (data.eventName) {
    case "TokenCreated": {
      // De-serialization
      dataStructure = {
        mint: data.eventData.mint.toBase58(),
        creator: data.eventData.creator.toBase58(),
        k: data.eventData.k.toNumber(),
        basePrice: data.eventData.base_price.toNumber(),
        timestamp: new Date(data.eventData.timestamp * 1000),
      };

      console.log("Token created: ", dataStructure);
      try {
        // update db
        const newToken = await prisma.token.findUnique({
          where: {
            mint: dataStructure.mint,
            creator: dataStructure.creator,
          },
        });

        if (!newToken) {
          throw new Error(
            "New token not found, failed to initialize bonding curve!",
          );
        }

        await prisma.$transaction(async (tx) => {
          // initialize bonding curve state
          await tx.bondingCurveState.upsert({
            create: {
              mint: (dataStructure as TokenCreatedEventData).mint,
              creator: (dataStructure as TokenCreatedEventData).creator,
              timestamp: (dataStructure as TokenCreatedEventData).timestamp,
            },
            update: {
              mint: (dataStructure as TokenCreatedEventData).mint,
              creator: (dataStructure as TokenCreatedEventData).creator,
              timestamp: (dataStructure as TokenCreatedEventData).timestamp,
            },
            where: {
              mint: (dataStructure as TokenCreatedEventData).mint,
            },
          });

          // update latest slot processed
          await tx.latestTxn.update({
            where: {
              id: "dumb-fun-indexer",
            },
            data: {
              sig: data.latestTxn.sig,
              slot: data.latestTxn.slot,
            },
          });
        });
      } catch (error) {
        throw error;
      }
      break;
    }
    case "BuyEvent": {
      // De-serialization
      dataStructure = {
        mint: data.eventData.mint.toBase58(),
        user: data.eventData.user.toBase58(),
        solAmount: data.eventData.sol_amount.toNumber(),
        tokenAmount: data.eventData.token_amount.toNumber(),
        newSupply: data.eventData.new_supply.toNumber(),
        newReserve: data.eventData.new_reserve.toNumber(),
        direction: Direction.BUY,
        price: data.eventData.price.toNumber(),
        timestamp: new Date(data.eventData.timestamp * 1000),
      };

      console.log("Trade: ", dataStructure);
      try {
        // update db
        await prisma.$transaction(async (tx) => {
          // create new trade
          await tx.trade.create({
            data: {
              mint: (dataStructure as TradeEventData).mint,
              direction: (dataStructure as TradeEventData).direction,
              user: (dataStructure as TradeEventData).user,
              solAmount: (dataStructure as TradeEventData).solAmount,
              tokenAmount: (dataStructure as TradeEventData).tokenAmount,
              timeStamp: (dataStructure as TradeEventData).timestamp,
            },
          });

          console.log(
            "bonding curve update failing for mint: ",
            dataStructure.mint,
          );

          // update bonding curve state
          await tx.bondingCurveState.update({
            where: {
              mint: dataStructure.mint,
            },
            data: {
              supply: (dataStructure as TradeEventData).newSupply,
              reserve: (dataStructure as TradeEventData).newReserve,
            },
          });

          // update latest slot processed
          await tx.latestTxn.update({
            where: {
              id: "dumb-fun-indexer",
            },
            data: {
              sig: data.latestTxn.sig,
              slot: data.latestTxn.slot,
            },
          });
        });
      } catch (error) {
        throw error;
      }
      break;
    }
    case "SellEvent": {
      dataStructure = {
        mint: data.eventData.mint.toBase58(),
        user: data.eventData.user.toBase58(),
        solAmount: data.eventData.sol_amount.toNumber(),
        tokenAmount: data.eventData.token_amount.toNumber(),
        newSupply: data.eventData.new_supply.toNumber(),
        newReserve: data.eventData.new_reserve.toNumber(),
        direction: Direction.SELL,
        price: data.eventData.price.toNumber(),
        timestamp: new Date(data.eventData.timestamp * 1000),
      };

      console.log("Trade: ", dataStructure);
      try {
        // update db
        await prisma.$transaction(async (tx) => {
          // create new trade
          await tx.trade.create({
            data: {
              mint: (dataStructure as TradeEventData).mint,
              direction: (dataStructure as TradeEventData).direction,
              user: (dataStructure as TradeEventData).user,
              solAmount: (dataStructure as TradeEventData).solAmount,
              tokenAmount: (dataStructure as TradeEventData).tokenAmount,
              timeStamp: (dataStructure as TradeEventData).timestamp,
            },
          });

          // update bonding curve state
          await tx.bondingCurveState.update({
            where: {
              mint: dataStructure.mint,
            },
            data: {
              supply: (dataStructure as TradeEventData).newSupply,
              reserve: (dataStructure as TradeEventData).newReserve,
            },
          });

          // update latest slot processed
          await tx.latestTxn.update({
            where: {
              id: "dumb-fun-indexer",
            },
            data: {
              sig: data.latestTxn.sig,
              slot: data.latestTxn.slot,
            },
          });
        });
      } catch (error) {
        throw error;
      }
      break;
    }
    default: {
      console.error("Invalid event!");
      break;
    }
  }
};

// filter missed data
export const backfillData = async () => {
  const programId = new PublicKey(program.programId);

  const latestTxRecord = await prisma.latestTxn.findFirst({
    where: {
      id: "dumb-fun-indexer",
    },
    select: { sig: true },
  });

  if (!latestTxRecord) {
    console.error("Latest txn record not found!");
    return;
  }

  let signaturesInfo;
  if (latestTxRecord.sig.length === 0) {
    signaturesInfo = await connection.getSignaturesForAddress(programId, {
      limit: 100,
    });
  } else {
    signaturesInfo = await connection.getSignaturesForAddress(programId, {
      until: latestTxRecord.sig,
      limit: 100,
    });
  }

  const signatureList = signaturesInfo.map((tx) => tx.signature);
  signatureList.reverse(); // reverse the received slots to inceasing order

  for (let sig of signatureList) {
    const txDetail = await connection.getParsedTransaction(sig, "confirmed");
    await decodeInstructionMeta(txDetail);
  }

  return;
};
