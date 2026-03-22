export type TradeType = "buy" | "sell";

export interface Trade {
  mint: string;
  type: TradeType;
  price: number;
  solAmount: number;
  tokenAmount: number;
}