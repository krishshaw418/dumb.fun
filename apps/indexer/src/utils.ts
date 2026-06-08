import { BorshInstructionCoder, BorshCoder, Idl } from "@coral-xyz/anchor";
import idl from "../../../target/idl/dumbfun.json";
import {
  TokenCreatedEventData,
  TradeEventData,
  Direction,
} from "../../../packages/types/types";
import { prisma } from "db";

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
export const decodeInstructionMeta = (data: any) => {
  const programLogs = data.transaction.transaction.meta.logMessages;
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
        processAndSaveData({
          eventName: event.name,
          eventData: event.data,
        }).catch((err) => {
          console.error(err);
          return;
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
        await prisma.bondingCurveState.create({
          data: {
            mint: (dataStructure as TokenCreatedEventData).mint,
            creator: (dataStructure as TokenCreatedEventData).creator,
            timestamp: (dataStructure as TokenCreatedEventData).timestamp
          }
        });
      } catch (error) {
        console.error(error);
        return;
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
        });
      } catch (error) {
        console.error(error);
        return;
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
        });
      } catch (error) {
        console.error(error);
        return;
      }
      break;
    }
    default: {
      console.error("Invalid event!");
      break;
    }
  }
};
