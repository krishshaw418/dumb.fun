import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Token } from "types";
import axios from "axios";
import type { TokenDataUi } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const structureTokenData = async (token: Token) => {
  try {
    const response = await axios.get(`${token.url}`);

    const structuredTokenData: TokenDataUi = {
      name: token.name,
      symbol: token.symbol,
      img: response.data.image,
      description: response.data.description ?? "",
      marketCap: "$1.27M",
      createdAt: "2y",
    };

    return structuredTokenData;
  } catch (error) {
    console.error(error);
    return;
  }
};
