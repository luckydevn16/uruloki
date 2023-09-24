import { percentChange } from "../../../number-helpers"
import { TopGainer } from "../../../../g_queries"
import { getPriceData } from "../getPriceData"
import { PrismaClient } from "@prisma/client"
import { upsertAndGetId } from "../../token_cache"

type UpdateTopMoversResult = {
    success: boolean,
    message: string
}

type TopMoverTokenCache = {
    id: number,
    token: TopGainer
}

const prisma = new PrismaClient();

export async function updateTopMovers(MINIMUM_TX_COUNT: number, bitqueryData: any[]): Promise<UpdateTopMoversResult> {
    //Filter out all tokens with less transactions thatn MINIMUM_TX_COUNT, to filter out low quality tokens
    let topMovers = bitqueryData?.filter(a => a.count > MINIMUM_TX_COUNT)

    //Preliminary calculation of percent change using "wrong" price
    topMovers = topMovers?.map(item => {
        return {
            ...item,
            percentChange: item.percentChange = percentChange(item.earliest_price, item.latest_price)
        }
    })

    //Sort by absolute value of percent change
    topMovers = topMovers?.sort((a, b) => Math.abs((b?.percentChange ?? 0) - (a?.percentChange ?? 0)))

    //Trim down to top 100 tokens
    topMovers = topMovers.slice(0,100)

    //Calculate actual price
    let finalList = await getPriceData(topMovers)

    finalList = finalList.sort((a,b) => Math.abs((b.percentChange ?? 0) - (a.percentChange ?? 0)))
    
    //Remove tokens with "infinite" percent change
    finalList = finalList.filter(a => a.percentChange != Infinity)

    //Remove tokens with negative percent change
    finalList = finalList.filter(a => a.percentChange && a.percentChange > 0)
    finalList.forEach(token => {
        console.log(token)
    })

    //Clear top movers table
    await prisma.top_movers.deleteMany({})

    //Insert token data into token_cache and track the ids
    let tokenCacheTokens: Array<TopMoverTokenCache> = []
    for(let item of finalList) {
        let symbol = item.buyCurrency.symbol
        let name = item.buyCurrency.name
        if(symbol == "WETH") {
            symbol = item.sellCurrency.symbol
            name = item.sellCurrency.name
        }
        
        const id = await upsertAndGetId({
            name,
            pair_address: item.smartContract.address.address,
            price: item.latest_price,
            change_24hr: item.percentChange ?? 0,
            volume: item.volumeUSD,
            market_cap: 0,
            address: item.buyCurrency.symbol == name ? item.buyCurrency.address : item.sellCurrency.address,
            short_name: symbol
        })

        tokenCacheTokens.push({
            id,
            token: item
        })
    }
    
    //Write to top_movers table
    tokenCacheTokens.forEach(async (item, index) => {
        await prisma.top_movers.create({
            data: {
                rank: index + 1,
                token_cache_id: item.id
            }
        })
    })

    return {
        success: true,
        message: "Successfully updated top movers"
    }
}