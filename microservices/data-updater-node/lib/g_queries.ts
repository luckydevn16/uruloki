import { Result, TopGainer } from "./types";
import axios from "axios";

export const G_QUERY_GetTopGainersAndMovers = async (
    network: string,
    start: Date,
    end: Date
  ): Promise<Result<Array<TopGainer>, any>> => {
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
        success: false,
        error: data.error
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
        data: topGainers
      }
    }
  };