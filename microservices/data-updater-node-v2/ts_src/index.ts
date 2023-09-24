import { PrismaClient } from "@prisma/client";
import { updateTopGainers } from "./lib/server/tokens/update/topGainers";
import { updateTokenCacheMarketCap } from "./lib/server/tokens/update/marketCap";
import { purgeTokenCache } from "./lib/server/tokens/update/purgeTokenCache";
import { G_QUERY_GetTopGainersAndMovers } from "./g_queries";
import { updateTopMovers } from "./lib/server/tokens/update/topMovers";
import { OrderCount, updateMostOrders } from "./lib/server/tokens/update/mostOrders";

const prisma = new PrismaClient();

async function updateTokenData() {
  try {
    const MINIMUM_TX_COUNT = 300

    var now = Date.now()
    var yesterday = now - (3600 * 24 * 1000)

    console.log("Getting token data from bitquery...")
    const result = await G_QUERY_GetTopGainersAndMovers("ethereum", new Date(yesterday), new Date())
    
    //Handle any errors with the query
    if(!result.success || !result.topGainers) {
        return {
            success: false,
            message: "Unable to fetch top movers"
        }
    }

    const bitqueryData = result.topGainers
    
    //Update data for top gainers by updating top_gainers and adding tokens to token_cache
    console.log("Getting top gainers...")
    const updateTopGainersResult = await updateTopGainers(MINIMUM_TX_COUNT, bitqueryData)
    
    console.log("Getting top movers...")
    const updateTopMoversResult = await updateTopMovers(MINIMUM_TX_COUNT, bitqueryData)

    console.log("Getting order data...")        
    const allOrders = await prisma.orders.findMany({
        include: {
            token_cache: true
        }
    })
    let orderCount: Array<OrderCount> = []
    
    allOrders.map((order: any) => {
        let count = orderCount.find(a => a.pair_address == order.pair_address)

        if(typeof(count) != "undefined") {
            if(order.order_type == "buy") {
                count.buyOrders += 1
            } else {
                count.sellOrders += 1
            }
        } else {
            orderCount.push({
                pair_address: order.pair_address,
                buyOrders: order.order_type == "buy" ? 1 : 0,
                sellOrders: order.order_type == "sell" ? 1 : 0,
                token_cache_id: order.token_cache?.id
            })
        }
    })

    console.log("Getting tokens with most buy orders...")
    const tokensWithMostBuyOrders = orderCount.sort((a, b) => b.buyOrders - a.buyOrders).slice(0, 100)

    console.log("Getting tokens with most sell orders...")
    const tokensWithMostSellOrders = orderCount.sort((a, b) => b.sellOrders - a.sellOrders).slice(0, 100)

    await updateMostOrders(tokensWithMostBuyOrders, tokensWithMostSellOrders)
    
    console.log("Updating market cap...")
    const updateMarketCapResult = await updateTokenCacheMarketCap()

    console.log("Purging token cache...")
    await purgeTokenCache()
    console.log("Purge complete!")
  } catch (err) {
    console.log("Error updating token data: ", err)
  }
}

updateTokenData()
setInterval(updateTokenData, 1000 * 60 * 60)