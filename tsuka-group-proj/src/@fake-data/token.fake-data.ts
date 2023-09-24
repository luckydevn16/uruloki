import { Token } from "@/types/token.type";

export const tokenData: Token = {
  id: "0x99ac8ca7087fa4a2a1fb6357269965a2014abc35",
  token: "Ethereum",
  chain: {
    name: "Ethereum",
    code: "ETH",
    address: "0xD779BCA1E021aBF9C184d417c6339EAD850e10E6",
  },
  pair: {
    code: "BTC",
    name: "Bitcoin",
    address: "0xD779BCA1E021aBF9C184d417c6339EAD850e10E6",
  },
  price: {
    value: 4095.98,
    operator: "+",
    variationValue: 0.76,
    variationValueDiference: 0.00523,
  },
  volume: {
    value: 32987497674,
    currencyLabel: "Billions",
  },
  marketCap: {
    value: "476,892,747,054",
    currencyLabel: "Billions",
  },
  nOrders: {
    value: "103,912",
    currencyLabel: "Millions",
  },
  orderSplit: {
    buy: 3782,
    sell: 3154,
  },
};

export const tokensData: Array<Token> = [
  {
    id: "1",
    strategy_id: "1",
    token: "Ethereum",
    chain: {
      name: "Ethereum",
      code: "ETH",
      address: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
    },
    pair: {
      code: "BTC",
      name: "Bitcoin",
      address: "0xcbcdf9626bc03e24f779434178a73a0b4bad62ed",
    },
    price: {
      value: 32987.54,
      operator: "+",
      variationValue: 0.76,
      variationValueDiference: 0.00523,
    },
    volume: {
      value: 32987.54,
      currencyLabel: "Billions",
    },
    marketCap: {
      value: "476,892,747,054",
      currencyLabel: "Billions",
    },
    nOrders: {
      value: "103,912",
      currencyLabel: "Millions",
    },
    orderSplit: {
      buy: 3782,
      sell: 3154,
    },
  },
  {
    id: "2",
    strategy_id: "2",
    token: "Bitcoin",
    chain: {
      name: "Bitcoin",
      code: "BTC",
      address: "",
    },
    pair: {
      code: "ETH",
      name: "Ethereum",
      address: "",
    },
    price: {
      value: 32987.54,
      operator: "-",
      variationValue: 0,
    },
    volume: {
      value: 32987.54,
      currencyLabel: "Billions",
    },
    marketCap: {
      value: "",
      currencyLabel: "Billions",
    },
    nOrders: {
      value: "",
      currencyLabel: "Millions",
    },
    orderSplit: {
      buy: 0,
      sell: 0,
    },
  },
];
