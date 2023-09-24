import { CDAL } from "crypto-data-abstraction-layer"
import { G_QUERY_GetTopGainersAndMovers } from "./g_queries"
import { percentChange } from "./number-helpers"
import { PricingData } from "crypto-data-abstraction-layer/dist/types"
import { PrismaClient } from "@prisma/client"
import { TopGainerTokenCache } from "./types"

require('dotenv').config()
const prisma = new PrismaClient();

CDAL.init({
  bitqueryKey: process.env.BITQUERY_API_KEY ?? "",
  etherscanKey: process.env.ETHERSCAN_KEY ?? "",
  ethplorerKey: "",
  providerUrl: process.env.PROVIDER_MAINNET_URL ?? "",
})

async function run() {
    console.log("Getting updated token info...")
    
    try {
      const MINIMUM_TX_COUNT = 300

      var now = Date.now()
      var yesterday = now - (3600 * 24 * 1000)
      const topGainers = await G_QUERY_GetTopGainersAndMovers("ethereum", new Date(yesterday), new Date())
      if(!topGainers.success || !topGainers.data) {
        throw new Error("Unable to fetch top gainers")
      }
      

    
      //Get updated market cap, liquidity, price, percent change, and holders
      for(const token of tokens) {
        const project: TokenProject = {
          contract_address: token.contract_address,
          pair_address: token.pair_address,
          project_data: {
            id: token.project_data[0].id,
            created_at: token.project_data[0].created_at,
            project_id: token.project_data[0].project_id,
            market_cap: token.project_data[0].market_cap,
            liquidity_usd: token.project_data[0].liquidity_usd,
            deployer_funds: token.project_data[0].deployer_funds,
            rating: token.project_data[0].rating,
            category: token.project_data[0].category,
            price: token.project_data[0].price,
            percent_change: token.project_data[0].percent_change,
            holders: token.project_data[0].holders,
            is_audited: token.project_data[0].is_audited
          }
        }
  
        const pricingData = await CDAL.getPriceData(project.contract_address, project.pair_address)
        console.log(project.pair_address)
        console.log(pricingData)

        if(!pricingData.success || !pricingData?.data) {
          return
        }
  
        project.project_data.price = pricingData.data.price
        project.project_data.percent_change = pricingData.data.percentChange
  
        const marketCap = await CDAL.getFDV(project.contract_address, project.project_data.price)
        if(!marketCap.success || !marketCap?.data) {
          return
        }
        console.log("$" +  marketCap.data.toLocaleString("en-us", {maximumFractionDigits:2}))
  
        const holders = await CDAL.getHolders(project.contract_address)
        if(!holders.success || !holders?.data) {
          return
        }
        console.log("Holders: " + holders.data)
  
        const result = await supabase.from("project_data")
                  .update({
                    price: project.project_data.price,
                    percent_change: project.project_data.percent_change,
                    market_cap: marketCap,
                    holders: holders
                  })
                  .eq("id", project.project_data.id)
      }
  
      console.log("Successfully updated token data")
      return
    } catch (err) {
        console.log("Error while updating token data")
        console.log(err)
        return
    }
}

run()

setInterval(run, 1000 * 60 * 60) //Run every hour

async function updateTopGainers(MINIMUM_TX_COUNT: number, bitqueryData: any[]) {
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
  let finalList: Array<PricingData> = []
  for(let topGainer of topGainers) {
    const res = await CDAL.getPriceData(topGainer.buyCurrency.address.address, topGainer.smartContract.address.address)
    if(res.success && res.data) {
      finalList.push({
        ...res.data,
        ...topGainer
      })
    }
  }

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