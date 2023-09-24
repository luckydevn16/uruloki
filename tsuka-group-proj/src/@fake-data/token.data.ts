import { TokenType } from "@/types/tokens.type";

export const Tokens: Array<TokenType> = [
  {
    id: 1,
    amount: 3.1234,
    value: "6.950",
    shortName: "LTC",
    name: "Litecoin",
  },
  {
    id: 1,
    amount: 5.1234,
    value: "6.950",
    shortName: "ANCH",
    name: "Avalanche",
  },
  {
    id: 2,
    amount: 3.0034,
    value: "6.950",
    shortName: "ETH",
    name: "Ethereum",
  },
  {
    id: 3,
    amount: 1.1234,
    value: "6.950",
    shortName: "USDT",
    name: "Tether",
  },
  {
    id: 4,
    amount: 3.1254,
    value: "6.950",
    shortName: "BNB",
    name: "BNB",
  },
  {
    id: 5,
    amount: 3.0059,
    value: "6.950",
    shortName: "XRP",
    name: "XRP",
  },
  {
    id: 6,
    amount: 1.2115,
    value: "6.950",
    shortName: "ADA",
    name: "Cardano",
  },
  {
    id: 7,
    amount: 6.2513,
    value: "6.950",
    shortName: "DoGE",
    name: "Dogecoin",
  },
  {
    id: 8,
    amount: 3.1154,
    value: "6.950",
    shortName: "MaTIC",
    name: "Polygon",
  },
  {
    id: 9,
    amount: 7.1234,
    value: "6.950",
    shortName: "ETH",
    name: "Ethereum",
  },
  {
    id: 10,
    amount: 3.1954,
    value: "6.950",
    shortName: "DOT",
    name: "Polkadot",
  },
  {
    id: 11,
    amount: 10.1234,
    value: "6.950",
    shortName: "TRX",
    name: "TRON",
  },
  {
    id: 12,
    amount: 3.1234,
    value: "6.950",
    shortName: "BUSD",
    name: "Binance USD",
  },
  {
    id: 13,
    amount: 3.1234,
    value: "6.950",
    shortName: "BTC",
    name: "Bitcoin",
  },
  {
    id: 14,
    amount: 3.1234,
    value: "6.950",
    shortName: "SHIB",
    name: "Shiba Inu",
  },
  {
    id: 15,
    amount: 3.1234,
    value: "6.950",
    shortName: "KUBJ",
    name: "Chainlink",
  },
];

export const getTokensInWallet = () => {
  return Tokens;
};
