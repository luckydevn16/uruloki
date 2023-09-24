export type Result<T, J> = {
    success: boolean;
    data?: T;
    error?: J
}

export type TopGainer = {
    sellCurrency: Currency,
    buyCurrency: Currency,
    count: number,
    latest_price: number,
    earliest_price: number,
    volumeUSD: number,
    smartContract: Contract,
    percentChange?: number
}

export type Currency = {
    symbol: string,
    name: string,
    address: string
}
  
export type Contract = {
    address: {
      address: string
    }
}

export type TopGainerTokenCache = {
    id: number,
    token: TopGainer
}