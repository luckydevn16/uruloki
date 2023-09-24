import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function purgeTokenCache(): Promise<void> {
    //Get id of all referenced tokens
    const topGainerIds: Array<number> = (await prisma.top_gainers.findMany({})).map((item: any) => item.token_cache_id)
    const topMoverIds: Array<number> = (await prisma.top_movers.findMany({})).map((item: any) => item.token_cache_id)
    const mostBuyOrders: Array<number> = (await prisma.most_buy_orders.findMany({})).map((item: any) => item.token_cache_id)
    const mostSellOrders: Array<number> = (await prisma.most_sell_orders.findMany({})).map((item: any) => item.token_cache_id)

    const ids = [...topGainerIds, ...topMoverIds, ...mostBuyOrders, ...mostSellOrders]
    const uniqueIds = [...new Set(ids)]
    
    //Get id of all items in token cache
    const tokenCacheIds: Array<number> = (await prisma.token_cache.findMany({})).map((item: any) => item.id)
    
    //Delete all items in token cache that are not being referenced
    await prisma.token_cache.deleteMany({
        where: {
            id: {
                in: tokenCacheIds.filter(id => !uniqueIds.includes(id)) //All ids which are in token cache but not in any of the other tables
            }
        }
    })
}