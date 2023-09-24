export type TokenPriceInPair = {
  base_price: number;
  quote_price: number;
};

export interface TokenInfo {
  name?: string;
  address?: string;
  symbol?: string;
}

export type TokenPairInfo = {
  baseToken?: TokenInfo;
  pairedToken?: TokenInfo;
};

