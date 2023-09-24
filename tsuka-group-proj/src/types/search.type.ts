export type SearchToken = {
  id: string,
  name: string,
  symbol: string,
  address: number,
}

export type Token0 = {
  symbol: string,
  name: string,
}

export type SearchPair = {
  id: number,
  token0: Token0,
  token1: Token0,
}