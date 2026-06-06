export enum Direction {
  BUY = "buy",
  SELL = "sell"
};

export interface TradeEvent {
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

export interface TokenCreatedEvent {
  mint: string,
  creator: string,
  k: number,
  basePrice: number,
  timestamp: Date
}