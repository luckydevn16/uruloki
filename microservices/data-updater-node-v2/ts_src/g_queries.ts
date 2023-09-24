import axios from "axios";
import https from "https"

axios.defaults.timeout = 60000;
axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });

export const G_QUERY_GetTokenPair = (pair_address: string) => {
  return axios.post(
    "https://graphql.bitquery.io",
    {
      query: `
    query getPairTokenPrice($pair_address: String)
    {
      ethereum(network: ethereum) {
        dexTrades(
          smartContractAddress: {is: $pair_address}
          options: {limit: 1}
        ) {
          exchange {
            fullName
          }
          token0: baseCurrency {
            symbol
            address
            name
          }
          token1: quoteCurrency {
            symbol
            address
            name
          }
        }
      }
    }
    `,
      variables: {
        pair_address,
      },
    },
    {
      headers: {
        "X-API-KEY": process.env.BITQUERY_API_KEY,
      },
    }
  );
};

export const G_QUERY_GetTokenVolume = (baseTokenAddress: string) => {
  return axios.post(
    "https://graphql.bitquery.io",
    {
      query: `
    query getTokenVolume($baseTokenAddress: String, $timeSince: ISO8601DateTime, $timeTill: ISO8601DateTime)
    {
      ethereum(network: ethereum) {
        dexTrades(baseCurrency: {is: $baseTokenAddress}
        time: {since: $timeSince till: $timeTill}
        ) {
          tradeAmount(in: USD)
        }
      }
    }
    `,
      variables: {
        baseTokenAddress,
        timeSince: new Date(
          new Date().getTime() - 24 * 60 * 60 * 1000
        ).toISOString(),
        timeTill: new Date().toISOString(),
      },
    },
    {
      headers: {
        "X-API-KEY": process.env.BITQUERY_API_KEY,
      },
    }
  );
};

export const G_QUERY_GetQuotePrice = async (
  baseCurrency: string,
  quoteCurrency: string,
  timeBefore: string
) => {
  return axios.post(
    "https://graphql.bitquery.io",
    {
      query: `
      query getQuotePrice($baseCurrency: String, $quoteCurrency: String, $timeBefore: ISO8601DateTime)
      {
        ethereum(network: ethereum) {
          dexTrades(
            baseCurrency: {is: $baseCurrency}
            quoteCurrency: {is: $quoteCurrency}
            options: {desc: ["block.timestamp.time", "transaction.index"], limit: 1}
            time: {before: $timeBefore}
          ) {
            block {
              height
              timestamp {
                time(format: "%Y-%m-%d %H:%M:%S")
              }
            }
            transaction {
              index
            }
            baseCurrency {
              symbol
            }
            quoteCurrency {
              symbol
            }
            quotePrice
          }
        }
      }
      `,
      variables: {
        baseCurrency,
        quoteCurrency,
        timeBefore,
      },
    },
    {
      headers: {
        "X-API-KEY": process.env.BITQUERY_API_KEY,
      },
    }
  );
};

export type GetTopGainersResponse = {
  success: boolean,
  topGainers?: Array<TopGainer>
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

export const G_QUERY_GetTopGainersAndMovers = async (
  network: string,
  start: Date,
  end: Date
): Promise<GetTopGainersResponse> => {
  const startIsoString = start.toISOString().split(".")[0]
  const endIsoString = end.toISOString().split(".")[0]

  const {data} = await axios.post(
    "https://graphql.bitquery.io",
    {
      query: `
      query (
        $network: EthereumNetwork!, 
        $limit: Int!, 
        $offset: Int!, 
        $start: ISO8601DateTime, 
        $end: ISO8601DateTime
      ) {
        ethereum(network: $network) {
          dexTrades(
            options: {
              desc: "count", 
              limit: $limit, 
              offset: $offset
            }
            date: {
              since: $start, 
              till: $end
            }
            buyCurrency: {
              notIn: [
                "0x6B175474E89094C44Da98b954EedeAC495271d0F", 
                "0xdAC17F958D2ee523a2206206994597C13D831ec7", 
                "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", 
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", 
                "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
              ]
            }
          ) {
            sellCurrency {
              symbol
              name
              address
            }
            buyCurrency {
              symbol
              name
              address
            }
            count
            latest_price: maximum(of: block, get: price)
            earliest_price: minimum(of: block, get: price)
            volumeUSD: tradeAmount(in: USD)
            smartContract {
              address {
                address
              }
            }
          }
        }
      }`,
      variables: {
        "limit": 10000,
        "offset": 0,
        "network": network,
        "start": startIsoString,
        "end": endIsoString,
        "dateFormat": "%Y-%m-%dT%H:%M:%S"
      },
    },
    {
      headers: {
        "X-API-KEY": process.env.BITQUERY_API_KEY,
      },
    }
  );

  if(data.error) {
    return {
      success: false
    }
  } else {
    const dexTrades = data.data.ethereum.dexTrades
    const topGainers = dexTrades.map((item: any) => {
      return {
        ...item,
        latest_price: Number.parseFloat(item.latest_price),
        earliest_price: Number.parseFloat(item.earliest_price)
      }
    })
    return {
      success: true,
      topGainers
    }
  }
};