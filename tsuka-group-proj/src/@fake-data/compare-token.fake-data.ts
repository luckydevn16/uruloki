import { Compare } from "@/types/compare.type";

export const compareTokenData: Array<Compare> = [
  {
    inputToken: {
      name: "Bitcoin",
      code: "BTC",
    },
    outputToken: {
      name: "Ethereum",
      code: "ETH",
    },
    network: "Seven Metrics Coin",
    value: 4095.98,
    diference: {
      operator: "+",
      value: 0.76,
    },
  },
  {
    inputToken: {
      name: "Ethereum",
      code: "ETH",
    },
    outputToken: {
      name: "Bitcoin",
      code: "BTC",
    },
    network: "Seven Metrics Coin",
    value: 4095.98,
    diference: {
      operator: "+",
      value: 0.76,
    },
  },
];
