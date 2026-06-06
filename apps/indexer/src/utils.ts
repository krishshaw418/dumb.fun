import { BorshInstructionCoder, BorshCoder, Idl } from "@coral-xyz/anchor";
import idl from "../../../target/idl/dumbfun.json";
import { TokenCreatedEvent, TradeEvent, Direction } from "../../../packages/types/types";
import { prisma } from "db";

const coder = new BorshInstructionCoder(idl as Idl);
const eventCoder = new BorshCoder(idl as Idl);

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
              processData({ eventName: event?.name, eventData: event?.data });
            } catch (error) {
                console.error(error);
                return;
            }
        }
    }
}

export const processData = (data: {
  eventName: any;
  eventData: any;
}) => {

  let dataStructure: any;

  switch (data.eventName) {
    case "TokenCreated": {
      dataStructure = {
        mint: data.eventData.mint.toBase58(),
        creator: data.eventData.creator.toBase58(),
        k: data.eventData.k.toNumber(),
        basePrice: data.eventData.base_price.toNumber(),
        timestamp: new Date(data.eventData.timestamp * 1000)
      } as TokenCreatedEvent;

      console.log("TokenCreated: \n", dataStructure);
      break;
    }
    case "BuyEvent": {
      dataStructure = {
        mint: data.eventData.mint.toBase58(),
        user: data.eventData.user.toBase58(),
        solAmount: data.eventData.sol_amount.toNumber(),
        tokenAmount: data.eventData.token_amount.toNumber(),
        newSupply: data.eventData.new_supply.toNumber(),
        newReserve: data.eventData.new_reserve.toNumber(),
        direction: Direction.BUY,
        price: data.eventData.price.toNumber(),
        timestamp: new Date(data.eventData.timestamp * 1000)
      } as TradeEvent;

      console.log("Trade: ", dataStructure);
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
        timestamp: new Date(data.eventData.timestamp * 1000)
      } as TradeEvent;

      console.log("Trade: ", dataStructure);
      break;
    }
    default: {
      console.log("Invalid event!");
      break;
    }
  }
}