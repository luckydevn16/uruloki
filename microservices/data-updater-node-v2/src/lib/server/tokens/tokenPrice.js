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
exports.get_price_base2usd = exports.is_usdt_or_usdc = void 0;
const g_queries_1 = require("../../../g_queries");
const token_pair_1 = require("../../token-pair");
function getTokenPrice(pair_address, yesterday) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function* () {
        const time_before = (yesterday
            ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
            : new Date()).toISOString();
        const pair_find_result = yield (0, token_pair_1.getTokenNamesFromPair)(pair_address); /* Find token pair from pair_address */
        if (pair_find_result.success !== true) {
            return {
                message: `Pair address ${pair_address} not found`,
                success: false
            };
        }
        const pair_base_address = (_b = (_a = pair_find_result.tokenPairInfo) === null || _a === void 0 ? void 0 : _a.baseToken) === null || _b === void 0 ? void 0 : _b.address;
        const pair_quote_address = (_d = (_c = pair_find_result.tokenPairInfo) === null || _c === void 0 ? void 0 : _c.pairedToken) === null || _d === void 0 ? void 0 : _d.address;
        const pair_price_result = yield (0, g_queries_1.G_QUERY_GetQuotePrice)(pair_base_address, pair_quote_address, time_before); /* get price rate of base_token / quote_token */
        if (!((_e = pair_price_result.data.data.ethereum.dexTrades) === null || _e === void 0 ? void 0 : _e[0])) {
            return {
                success: false,
                message: `Transaction for ${pair_address} not found`,
            };
        }
        if (is_usdt_or_usdc((_h = (_g = (_f = pair_find_result.tokenPairInfo) === null || _f === void 0 ? void 0 : _f.baseToken) === null || _g === void 0 ? void 0 : _g.address) !== null && _h !== void 0 ? _h : "")) { //If the base token is usdt or usdc
            return {
                price: pair_price_result.data.data.ethereum.dexTrades[0].quotePrice,
                message: `Successfully found price quote for pair address ${pair_address}`,
                success: true
            };
        }
        else if (is_usdt_or_usdc((_l = (_k = (_j = pair_find_result.tokenPairInfo) === null || _j === void 0 ? void 0 : _j.pairedToken) === null || _k === void 0 ? void 0 : _k.address) !== null && _l !== void 0 ? _l : "")) { //If the paired token is usdt or usdc
            return {
                price: pair_price_result.data.data.ethereum.dexTrades[0].basePrice,
                message: `Successfully found price quote for pair address ${pair_address}`,
                success: true
            };
        }
        else { //If the base token is the "paired token", then get the price of the other token
            const base2usd_price = yield get_price_base2usd(pair_quote_address, time_before);
            if (base2usd_price) { /* Case of there is transaction pair base_token / USDT or base_token/USTC */
                return {
                    price: base2usd_price * pair_price_result.data.data.ethereum.dexTrades[0].quotePrice,
                    message: `Successfully found price quote for pair address ${pair_address}`,
                    success: true
                };
            }
            else { /* Else Use intermediate token */
                const quote2usd_price = yield get_price_base2usd(pair_quote_address, time_before);
                return {
                    price: quote2usd_price / pair_price_result.data.data.ethereum.dexTrades[0].quotePrice,
                    message: `Successfully found price quote for pair address ${pair_address}`,
                    success: true
                };
            }
        }
    });
}
exports.default = getTokenPrice;
function is_usdt_or_usdc(token_address) {
    return token_address === process.env.USDT_ADDR || token_address === process.env.USDC_ADDR;
}
exports.is_usdt_or_usdc = is_usdt_or_usdc;
function get_price_base2usd(base_address, time_before) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const usdt_price_result = yield (0, g_queries_1.G_QUERY_GetQuotePrice)(base_address, process.env.USDT_ADDR, time_before);
        if ((_a = usdt_price_result.data.data.ethereum.dexTrades) === null || _a === void 0 ? void 0 : _a[0]) {
            return (_c = (_b = usdt_price_result.data.data.ethereum.dexTrades) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.quotePrice;
        }
        else {
            const usdc_price_result = yield (0, g_queries_1.G_QUERY_GetQuotePrice)(base_address, process.env.USDC_ADDR, time_before);
            return (_e = (_d = usdc_price_result.data.data.ethereum.dexTrades) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.quotePrice;
        }
    });
}
exports.get_price_base2usd = get_price_base2usd;
