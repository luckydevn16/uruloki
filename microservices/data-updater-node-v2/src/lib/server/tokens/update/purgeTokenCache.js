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
exports.purgeTokenCache = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function purgeTokenCache() {
    return __awaiter(this, void 0, void 0, function* () {
        //Get id of all referenced tokens
        const topGainerIds = (yield prisma.top_gainers.findMany({})).map(item => item.token_cache_id);
        const topMoverIds = (yield prisma.top_movers.findMany({})).map(item => item.token_cache_id);
        const mostBuyOrders = (yield prisma.most_buy_orders.findMany({})).map(item => item.token_cache_id);
        const mostSellOrders = (yield prisma.most_sell_orders.findMany({})).map(item => item.token_cache_id);
        const ids = [...topGainerIds, ...topMoverIds, ...mostBuyOrders, ...mostSellOrders];
        const uniqueIds = [...new Set(ids)];
        //Get id of all items in token cache
        const tokenCacheIds = (yield prisma.token_cache.findMany({})).map(item => item.id);
        //Delete all items in token cache that are not being referenced
        yield prisma.token_cache.deleteMany({
            where: {
                id: {
                    in: tokenCacheIds.filter(id => !uniqueIds.includes(id)) //All ids which are in token cache but not in any of the other tables
                }
            }
        });
    });
}
exports.purgeTokenCache = purgeTokenCache;
