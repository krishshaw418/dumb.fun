import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// import * as anchor from "@coral-xyz/anchor"
// import { Program } from "@coral-xyz/anchor"
// import type { Dumbfun } from "../../../../target/types/dumbfun"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// const provider = anchor.AnchorProvider.env();
// anchor.setProvider(provider);
// export const program = anchor.workspace.Dumbfun as Program<Dumbfun>;