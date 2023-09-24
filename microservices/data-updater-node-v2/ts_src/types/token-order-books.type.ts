export type TokenOrderBook = {
  price: number;
  size: number;
};

export type TokenOrderBooks = {
  id: string;
  buy: TokenOrderBook[];
  sell: TokenOrderBook[];
};
