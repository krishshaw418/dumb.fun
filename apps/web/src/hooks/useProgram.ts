import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idl from "../../../../target/idl/dumbfun.json";

export function useProgram() {
  const provider = AnchorProvider.local();
  const program = new Program(idl, provider);

  return { program };
}
