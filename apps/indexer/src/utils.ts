import { BorshInstructionCoder, BorshCoder, Idl } from "@coral-xyz/anchor";
import idl from "../../../target/idl/dumbfun.json";

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
                console.log(`Event: ${event?.name}\n`);
                console.log(`Event Data: `, event?.data);
            } catch (error) {
                console.error(error);
                return;
            }
        }
    }
}
