import { TokenPairInfo } from "@/types";
import axios from "axios";

export type HistoricalDexTrades = {
  side: string;
  tradeAmount: number;
  transaction: any;
  timestamp?: string;
  tokenPairInfo?: TokenPairInfo;
};

export type HistoricalDexTradesResult = {
  success: boolean;
  historicalDexTrades?: Array<HistoricalDexTrades>;
};

export type DexTrade = {
  block: { timestamp: { time: string } };
  tradeAmount: number;
  side: string;
  sellAmount: number;
  buyAmount: number;
  transaction: Object;
};

export async function getHistoricalDexTrades(
  baseAddress: string,
  quoteAddress: string
): Promise<HistoricalDexTradesResult> {
  try {
    const { data } = await axios.post(
      "https://graphql.bitquery.io/",
      {
        query: `{
              ethereum(network: ethereum) {
                dexTrades(
                  baseCurrency: {is: "${baseAddress}"}
                  quoteCurrency: {is: "${quoteAddress}"}
                  options: {desc: ["block.timestamp.time", "transaction.index"], limit: 500}
                ) {
                  block {
                    height
                    timestamp {
                      time(format: "%Y-%m-%d %H:%M:%S")
                    }
                  }
                  side
                  sellAmount(in: USD)
                  buyAmount(in: USD)
                  transaction {
                    index
                    txFrom {
                      address
                    }
                  }
                }
              }
          }`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.BITQUERY_API_KEY,
        },
      }
    );

    const dexTrades = data?.data?.ethereum?.dexTrades.map((trade: DexTrade) => {
      const amount = trade.side === "SELL" ? trade.buyAmount : trade.sellAmount;
      return {
        side: trade.side,
        tradeAmount: amount,
        transaction: trade.transaction,
        timestamp: trade.block.timestamp.time,
      };
    });

    if (dexTrades && dexTrades.length) {
      return {
        success: true,
        historicalDexTrades: dexTrades,
      };
    } else {
      return {
        success: false,
      };
    }
  } catch (error) {
    console.log("Unable to fetch historical dex trades for activity feed");
    return {
      success: false,
    };
  }
}
