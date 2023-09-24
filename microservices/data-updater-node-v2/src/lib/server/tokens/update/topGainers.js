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
exports.updateTopGainers = void 0;
const number_helpers_1 = require("../../../number-helpers");
const getPriceData_1 = require("../getPriceData");
const client_1 = require("@prisma/client");
const token_cache_1 = require("../../token_cache");
const prisma = new client_1.PrismaClient();
function updateTopGainers(MINIMUM_TX_COUNT, bitqueryData) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        //Filter out all tokens with less transactions thatn MINIMUM_TX_COUNT, to filter out low quality tokens
        let topGainers = bitqueryData === null || bitqueryData === void 0 ? void 0 : bitqueryData.filter(a => a.count > MINIMUM_TX_COUNT);
        //Preliminary calculation of percent change using "wrong" price
        topGainers = topGainers === null || topGainers === void 0 ? void 0 : topGainers.map(item => {
            return Object.assign(Object.assign({}, item), { percentChange: item.percentChange = (0, number_helpers_1.percentChange)(item.earliest_price, item.latest_price) });
        });
        //Sort by percent change
        topGainers = topGainers === null || topGainers === void 0 ? void 0 : topGainers.sort((a, b) => { var _a, _b; return ((_a = b === null || b === void 0 ? void 0 : b.percentChange) !== null && _a !== void 0 ? _a : 0) - ((_b = a === null || a === void 0 ? void 0 : a.percentChange) !== null && _b !== void 0 ? _b : 0); });
        //Trim down to top 100 tokens
        topGainers = topGainers.slice(0, 100);
        console.log("Getting final prices...");
        //Calculate actual price
        let finalList = yield (0, getPriceData_1.getPriceData)(topGainers);
        finalList = finalList.sort((a, b) => { var _a, _b; return ((_a = b.percentChange) !== null && _a !== void 0 ? _a : 0) - ((_b = a.percentChange) !== null && _b !== void 0 ? _b : 0); });
        //Remove tokens with "infinite" percent change
        finalList = finalList.filter(a => a.percentChange != Infinity);
        //Remove tokens with negative percent change
        finalList = finalList.filter(a => a.percentChange && a.percentChange > 0);
        finalList.forEach(token => {
            console.log(token);
        });
        console.log("Clearing top_gainers table...");
        //Clear top gainers table
        yield prisma.top_gainers.deleteMany({});
        console.log("Upserting token data into token_cache...");
        //Insert token data into token_cache and track the ids
        let tokenCacheTokens = [];
        for (let item of finalList) {
            let symbol = item.buyCurrency.symbol;
            let name = item.buyCurrency.name;
            if (symbol == "WETH") {
                symbol = item.sellCurrency.symbol;
                name = item.sellCurrency.name;
            }
            const id = yield (0, token_cache_1.upsertAndGetId)({
                name,
                pair_address: item.smartContract.address.address,
                price: item.latest_price,
                change_24hr: (_a = item.percentChange) !== null && _a !== void 0 ? _a : 0,
                volume: item.volumeUSD,
                market_cap: 0,
                address: item.buyCurrency.symbol == name ? item.buyCurrency.address : item.sellCurrency.address,
                short_name: symbol
            });
            tokenCacheTokens.push({
                id,
                token: item
            });
        }
        console.log("Writing to top_gainers...");
        //Write to top_gainers table
        tokenCacheTokens.forEach((item, index) => __awaiter(this, void 0, void 0, function* () {
            yield prisma.top_gainers.create({
                data: {
                    rank: index + 1,
                    token_cache_id: item.id
                }
            });
        }));
        return {
            success: true,
            message: "Successfully updated top gainers"
        };
    });
}
exports.updateTopGainers = updateTopGainers;
