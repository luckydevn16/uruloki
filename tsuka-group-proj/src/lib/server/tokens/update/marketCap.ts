import { Etherscan } from "@/lib/etherscan/etherscan";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UdateTokenCacheMarketCapResult = {
    success: boolean,
    message: string
}

export async function updateTokenCacheMarketCap(): Promise<UdateTokenCacheMarketCapResult> {
    const tokenCacheTokens = await prisma.token_cache.findMany({})

    for(let token of tokenCacheTokens) {
        console.log(`Updating market cap for ${token.short_name}`)
        try {
            if(token.address && token.price) {
                const marketCap = await Etherscan.getFDV(token.address, token.price)
                console.log(marketCap.toLocaleString("en-us", {maximumFractionDigits:2}))
                await prisma.token_cache.update({
                    where: {
                        id: token.id
                    },
                    data: {
                        market_cap: marketCap
                    }
                })
            }
        } catch (e) {
            console.log(`Unable to get market cap for ${token.short_name}`)
            console.log(e)
        }
    }

    return {
        success: true,
        message: "Successfully updated market cap"
    }
}