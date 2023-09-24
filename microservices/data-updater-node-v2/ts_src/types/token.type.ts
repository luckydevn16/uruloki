export type Token = {
  id: string;
  strategy_id?: string;
  token: string;
  chain: {
    name: string;
    code: string;
    address?: string;
  };
  pair?: {
    name: string;
    code: string;
    address: string;
  };
  price: {
    value: number;
    operator: "+" | "-";
    variationValue: number;
    variationValueDiference?: number;
  };
  volume: {
    value: number;
    currencyLabel: string;
  };
  marketCap: {
    value: string;
    currencyLabel: string;
  };
  nOrders: {
    value: string;
    currencyLabel: string;
  };
  orderSplit: {
    buy: number;
    sell: number;
  };
};
