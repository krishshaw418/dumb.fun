import * as anchor from "@coral-xyz/anchor";
import type { Dumbfun } from "../../../target/types/dumbfun";
import idl from "../../../target/idl/dumbfun.json";
import { connection } from "./connProvider";

const provider = new anchor.AnchorProvider(connection, {} as any);
anchor.setProvider(provider);

export const program = new anchor.Program<Dumbfun>(idl as Dumbfun, provider);

export const parser = new anchor.EventParser(program.programId, program.coder);
