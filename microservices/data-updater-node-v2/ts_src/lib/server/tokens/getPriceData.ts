import { TopGainer } from "../../../g_queries"
import { percentChange } from "../../number-helpers"
import { getTokenPrice } from "../../token-price"

/**
 * Takes a list of TopGainer items, and gets updated current price, previous (24hr ago) price, and percent change
 * @param tokens 
 * @param printProgress 
 * @returns 
 */
export async function getPriceData(tokens: Array<TopGainer>, printProgress=false): Promise<Array<TopGainer>> {
    let finalList: Array<TopGainer> = []
    let progress = 0

    
    let promiseList = tokens.map(async token => {
        try {
            const [earliest_price, latest_price] = await Promise.all([
                (await getTokenPrice(token.smartContract.address.address, true)).base_price,
                (await getTokenPrice(token.smartContract.address.address, false)).base_price
            ])
            const percent_change = percentChange(earliest_price, latest_price)

            progress ++
            if(printProgress) {
                console.log(`${progress}%`)
            }

            finalList.push({
                ...token,
                earliest_price,
                latest_price,
                percentChange: percent_change
            })
        } catch (e) {
            progress ++
            console.log(`Error getting data for ${token.buyCurrency.symbol}/${token.sellCurrency.symbol}`)
            console.log(e)
        }
    })

    await Promise.all(promiseList)
    return finalList
}