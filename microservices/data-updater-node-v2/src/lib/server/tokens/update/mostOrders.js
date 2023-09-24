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
exports.updateMostOrders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function updateMostOrders(tokensWithMostBuyOrders, tokensWithMostSellOrders) {
    return __awaiter(this, void 0, void 0, function* () {
        //Clear most_buy_orders and most_sell_orders tables and add new data
        const buyOrdersInsertData = tokensWithMostBuyOrders
            .map((item, index) => {
            var _a;
            return {
                token_cache_id: (_a = item.token_cache_id) !== null && _a !== void 0 ? _a : 0,
                rank: index + 1
            };
        }).filter(a => a.token_cache_id != 0)
            .map((item, index) => {
            item.rank = index + 1;
            return item;
        });
        const sellOrdersInsertData = tokensWithMostSellOrders
            .map((item, index) => {
            var _a;
            return {
                token_cache_id: (_a = item.token_cache_id) !== null && _a !== void 0 ? _a : 0,
                rank: index + 1
            };
        }).filter(a => a.token_cache_id != 0)
            .map((item, index) => {
            item.rank = index + 1;
            return item;
        });
        console.log("Writing most buy orders to database...");
        yield prisma.most_buy_orders.deleteMany({});
        yield prisma.most_buy_orders.createMany({
            data: buyOrdersInsertData
        });
        console.log("Writing most sell orders to database...");
        yield prisma.most_sell_orders.deleteMany({});
        yield prisma.most_sell_orders.createMany({
            data: sellOrdersInsertData
        });
    });
}
exports.updateMostOrders = updateMostOrders;
