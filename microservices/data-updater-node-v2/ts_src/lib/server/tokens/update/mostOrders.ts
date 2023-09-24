import { PrismaClient } from "@prisma/client";

export type OrderCount = {
    pair_address: string,
    buyOrders: number,
    sellOrders: number,
    token_cache_id: number | undefined
}

const prisma = new PrismaClient();

export async function updateMostOrders(tokensWithMostBuyOrders: Array<OrderCount>, tokensWithMostSellOrders: Array<OrderCount>) {
    //Clear most_buy_orders and most_sell_orders tables and add new data
    const buyOrdersInsertData = tokensWithMostBuyOrders
        .map((item, index) => {
            return {
                token_cache_id: item.token_cache_id ?? 0,
                rank: index + 1
            }
        }
        ).filter(a => a.token_cache_id != 0)
        .map((item, index) => {
            item.rank = index + 1
            return item
        })

    const sellOrdersInsertData = tokensWithMostSellOrders
        .map((item, index) => {
            return {
                token_cache_id: item.token_cache_id ?? 0,
                rank: index + 1
            }
        }
        ).filter(a => a.token_cache_id != 0)
        .map((item, index) => {
            item.rank = index + 1
            return item
        })

    console.log("Writing most buy orders to database...")
    await prisma.most_buy_orders.deleteMany({})
    await prisma.most_buy_orders.createMany({
        data: buyOrdersInsertData
    })

    console.log("Writing most sell orders to database...")
    await prisma.most_sell_orders.deleteMany({})
    await prisma.most_sell_orders.createMany({
        data: sellOrdersInsertData
    })
}