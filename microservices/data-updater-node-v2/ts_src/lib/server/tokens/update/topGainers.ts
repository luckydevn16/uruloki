import { percentChange } from "../../../number-helpers"
import { TopGainer } from "../../../../g_queries"
import { getPriceData } from "../getPriceData"
import { PrismaClient } from "@prisma/client"
import { upsertAndGetId } from "../../token_cache"

type UpdateTopGainersResult = {
    success: boolean,
    message: string
}

type TopGainerTokenCache = {
    id: number,
    token: TopGainer
}

const prisma = new PrismaClient();

export async function updateTopGainers(MINIMUM_TX_COUNT: number, bitqueryData: any[]): Promise<UpdateTopGainersResult> {
    //Filter out all tokens with less transactions thatn MINIMUM_TX_COUNT, to filter out low quality tokens
    let topGainers = bitqueryData?.filter(a => a.count > MINIMUM_TX_COUNT)

    //Preliminary calculation of percent change using "wrong" price
    topGainers = topGainers?.map(item => {
        return {
            ...item,
            percentChange: item.percentChange = percentChange(item.earliest_price, item.latest_price)
        }
    })

    //Sort by percent change
    topGainers = topGainers?.sort((a, b) => (b?.percentChange ?? 0) - (a?.percentChange ?? 0))

    //Trim down to top 100 tokens
    topGainers = topGainers.slice(0,100)

    console.log("Getting final prices...")

    //Calculate actual price
    let finalList = await getPriceData(topGainers)

    finalList = finalList.sort((a,b) => (b.percentChange ?? 0) - (a.percentChange ?? 0))
    
    //Remove tokens with "infinite" percent change
    finalList = finalList.filter(a => a.percentChange != Infinity)
    //Remove tokens with negative percent change
    
    finalList = finalList.filter(a => a.percentChange && a.percentChange > 0)
    finalList.forEach(token => {
        console.log(token)
    })

    console.log("Clearing top_gainers table...")

    //Clear top gainers table
    await prisma.top_gainers.deleteMany({})

    console.log("Upserting token data into token_cache...")

    //Insert token data into token_cache and track the ids
    let tokenCacheTokens: Array<TopGainerTokenCache> = []
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

    console.log("Writing to top_gainers...")

    //Write to top_gainers table
    tokenCacheTokens.forEach(async (item, index) => {
        await prisma.top_gainers.create({
            data: {
                rank: index + 1,
                token_cache_id: item.id
            }
        })
    })

    return {
        success: true,
        message: "Successfully updated top gainers"
    }
}