export type OrderBookPosition = {
  type: "Buy" | "Sell";
  depth: number;
  priceUsdt: number;
  amount: number;
  executionValue: number;
  address: string;
  timestamp: string;
};

export type TokenPositions = {
  id: string;
  buy: {
    totalValue: number;
    positions: Array<OrderBookPosition>;
  };
  sell: {
    totalValue: number;
    positions: Array<OrderBookPosition>;
  };
};
