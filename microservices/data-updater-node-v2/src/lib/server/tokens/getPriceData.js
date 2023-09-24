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
exports.getPriceData = void 0;
const number_helpers_1 = require("../../number-helpers");
const token_price_1 = require("../../token-price");
/**
 * Takes a list of TopGainer items, and gets updated current price, previous (24hr ago) price, and percent change
 * @param tokens
 * @param printProgress
 * @returns
 */
function getPriceData(tokens, printProgress = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let finalList = [];
        let progress = 0;
        let promiseList = tokens.map((token) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [earliest_price, latest_price] = yield Promise.all([
                    (yield (0, token_price_1.getTokenPrice)(token.smartContract.address.address, true)).base_price,
                    (yield (0, token_price_1.getTokenPrice)(token.smartContract.address.address, false)).base_price
                ]);
                const percent_change = (0, number_helpers_1.percentChange)(earliest_price, latest_price);
                progress++;
                if (printProgress) {
                    console.log(`${progress}%`);
                }
                finalList.push(Object.assign(Object.assign({}, token), { earliest_price,
                    latest_price, percentChange: percent_change }));
            }
            catch (e) {
                progress++;
                console.log(`Error getting data for ${token.buyCurrency.symbol}/${token.sellCurrency.symbol}`);
                console.log(e);
            }
        }));
        yield Promise.all(promiseList);
        return finalList;
    });
}
exports.getPriceData = getPriceData;
