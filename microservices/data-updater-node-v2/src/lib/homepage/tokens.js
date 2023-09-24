"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokens = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    let topGainers = [];
    let topMoversData = [];
    let mostBuyData = [];
    let mostSellData = [];
    try {
        topGainers = yield prisma.top_gainers.findMany({
            include: {
                token_cache: {
                    select: {
                        name: true,
                        price: true,
                        chain: true,
                        short_name: true,
                        change_24hr: true,
                        pair_address: true,
                    },
                },
            },
        });
    }
    catch (err) {
        console.log(err);
        topGainers = [];
    }
    try {
        const topMovers = yield prisma.top_movers.findMany({
            include: {
                token_cache: {
                    include: {
                        orders: true,
                    },
                },
            },
        });
        topMoversData = topMovers.map((tm) => {
            let sell_orders = 0;
            let buy_orders = 0;
            let total_orders = 0;
            tm.token_cache.orders.map((order) => {
                if (order.order_type === "sell") {
                    sell_orders++;
                }
                if (order.order_type === "buy") {
                    buy_orders++;
                }
                total_orders++;
            });
            const topmoverItem = tm;
            return Object.assign({}, delete topmoverItem["token_cache"]["orders"], delete topmoverItem["token_cache"]["last_updated"], topmoverItem, { buy_orders, sell_orders, total_orders, token_cache: tm.token_cache });
        });
    }
    catch (err) {
        console.log(err);
        topMoversData = [];
    }
    try {
        const mostBuy = yield prisma.most_buy_orders.findMany({
            include: {
                token_cache: {
                    include: {
                        orders: true,
                    },
                },
            },
        });
        mostBuyData = mostBuy.map((mb) => {
            let buy_orders = 0;
            let total_orders = 0;
            mb.token_cache.orders.map((order) => {
                if (order.order_type === "buy") {
                    buy_orders++;
                }
                total_orders++;
            });
            return Object.assign({}, {
                id: mb.id,
                rank: mb.rank,
                token_cache: {
                    name: mb.token_cache.name,
                    chain: mb.token_cache.chain,
                    short_name: mb.token_cache.short_name,
                    pair_address: mb.token_cache.pair_address,
                },
                buy_orders,
                total_orders,
            });
        });
    }
    catch (err) {
        console.log(err);
        mostBuyData = [];
    }
    try {
        const mostSell = yield prisma.most_sell_orders.findMany({
            include: {
                token_cache: {
                    include: {
                        orders: true,
                    },
                },
            },
        });
        mostSellData = mostSell.map((ms) => {
            let sell_orders = 0;
            let total_orders = 0;
            ms.token_cache.orders.map((order) => {
                if (order.order_type === "sell") {
                    sell_orders++;
                }
                total_orders++;
            });
            return Object.assign({}, {
                id: ms.id,
                rank: ms.rank,
                token_cache: {
                    name: ms.token_cache.name,
                    chain: ms.token_cache.chain,
                    short_name: ms.token_cache.short_name,
                    pair_address: ms.token_cache.pair_address,
                },
                sell_orders,
                total_orders,
            });
        });
    }
    catch (err) {
        console.log(err);
        mostSellData = [];
    }
    return {
        topGainers: topGainers,
        topMovers: topMoversData,
        mostBuyOrders: mostBuyData,
        mostSellOrders: mostSellData,
    };
});
exports.getTokens = getTokens;
