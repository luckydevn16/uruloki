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
const client_1 = require("@prisma/client");
const topGainers_1 = require("./lib/server/tokens/update/topGainers");
const marketCap_1 = require("./lib/server/tokens/update/marketCap");
const purgeTokenCache_1 = require("./lib/server/tokens/update/purgeTokenCache");
const g_queries_1 = require("./g_queries");
const topMovers_1 = require("./lib/server/tokens/update/topMovers");
const mostOrders_1 = require("./lib/server/tokens/update/mostOrders");
const prisma = new client_1.PrismaClient();
function updateTokenData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const MINIMUM_TX_COUNT = 300;
            var now = Date.now();
            var yesterday = now - (3600 * 24 * 1000);
            console.log("Getting token data from bitquery...");
            const result = yield (0, g_queries_1.G_QUERY_GetTopGainersAndMovers)("ethereum", new Date(yesterday), new Date());
            //Handle any errors with the query
            if (!result.success || !result.topGainers) {
                return {
                    success: false,
                    message: "Unable to fetch top movers"
                };
            }
            const bitqueryData = result.topGainers;
            //Update data for top gainers by updating top_gainers and adding tokens to token_cache
            console.log("Getting top gainers...");
            const updateTopGainersResult = yield (0, topGainers_1.updateTopGainers)(MINIMUM_TX_COUNT, bitqueryData);
            console.log("Getting top movers...");
            const updateTopMoversResult = yield (0, topMovers_1.updateTopMovers)(MINIMUM_TX_COUNT, bitqueryData);
            console.log("Getting order data...");
            const allOrders = yield prisma.orders.findMany({
                include: {
                    token_cache: true
                }
            });
            let orderCount = [];
            allOrders.map(order => {
                var _a;
                let count = orderCount.find(a => a.pair_address == order.pair_address);
                if (typeof (count) != "undefined") {
                    if (order.order_type == "buy") {
                        count.buyOrders += 1;
                    }
                    else {
                        count.sellOrders += 1;
                    }
                }
                else {
                    orderCount.push({
                        pair_address: order.pair_address,
                        buyOrders: order.order_type == "buy" ? 1 : 0,
                        sellOrders: order.order_type == "sell" ? 1 : 0,
                        token_cache_id: (_a = order.token_cache) === null || _a === void 0 ? void 0 : _a.id
                    });
                }
            });
            console.log("Getting tokens with most buy orders...");
            const tokensWithMostBuyOrders = orderCount.sort((a, b) => b.buyOrders - a.buyOrders).slice(0, 100);
            console.log("Getting tokens with most sell orders...");
            const tokensWithMostSellOrders = orderCount.sort((a, b) => b.sellOrders - a.sellOrders).slice(0, 100);
            yield (0, mostOrders_1.updateMostOrders)(tokensWithMostBuyOrders, tokensWithMostSellOrders);
            console.log("Updating market cap...");
            const updateMarketCapResult = yield (0, marketCap_1.updateTokenCacheMarketCap)();
            console.log("Purging token cache...");
            yield (0, purgeTokenCache_1.purgeTokenCache)();
            console.log("Purge complete!");
        }
        catch (err) {
            console.log("Error updating token data: ", err);
        }
    });
}
updateTokenData();
setInterval(updateTokenData, 1000 * 60 * 60);
