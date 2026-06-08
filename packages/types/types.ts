export enum Direction {
  BUY = "buy",
  SELL = "sell"
};

export interface TradeEventData {
  mint: string;
  user: string;
  solAmount: number;
  tokenAmount: number;
  newSupply: number;
  newReserve: number;
  direction: Direction;
  price: number;
  timestamp: Date;
}

export interface TokenCreatedEventData {
  mint: string,
  creator: string,
  k: number,
  basePrice: number,
  timestamp: Date
}

export interface TokenMetaData {
  mint: string;
  creator: string;
  name: string;
  symbol: string;
  url: string;
}
