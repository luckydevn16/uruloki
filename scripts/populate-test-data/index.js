const { PrismaClient } = require("@prisma/client");

async function run() {
    const prisma = new PrismaClient();
    await populate_token_cache(prisma)
    await populate_top_gainers(prisma)
    await populate_top_movers(prisma)
}

async function populate_token_cache(prisma) {
    let i = 0
    while (i < 100) {
        await prisma.token_cache.create(get_rand_token())
        i++
    }
}

async function populate_top_gainers(prisma) {
    let i = 1
    while (i < 100) {
        await prisma.top_gainers.create({
            data: {
                rank: i,
                token_cache_id: Math.floor(Math.random() * 100)
            }
        })
        i++
    }
}

async function populate_top_movers(prisma) {
    let i = 1
    while (i < 100) {
        await prisma.top_movers.create({
            data: {
                rank: i,
                token_cache_id: Math.floor(Math.random() * 100)
            }
        })
        i++
    }
}

function get_rand_token() {
    let name = "Test_Token" + Math.floor(Math.random() * 1000)
    let chain = "ETH"
    let address = "0x" + (Math.floor(Math.random() * 10e7) + 10e8)
    let price = Math.floor(Math.random() * 1000)
    let hr_change = Math.floor(Math.random() * 100)
    let volume = Math.floor(Math.random() * 100000000)
    let market_cap = Math.floor(Math.random() * 100000000)

    return {
        data: {
            name,
            chain,
            address,
            price,
            hr_change,
            volume,
            market_cap
        }
    }
}

run()