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
exports.getTokenPrice = void 0;
const g_queries_1 = require("../g_queries");
const getTokenPrice = (pair_address, yesterday = false) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const timeBefore = (yesterday
        ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        : new Date()).toISOString();
    if (!pair_address) {
        console.log("token-price.ts: No pair address provided");
        return {
            base_price: 0,
            quote_price: 0
        };
    }
    //Query bitquery
    const tokenPairResponse = yield (0, g_queries_1.G_QUERY_GetTokenPair)(pair_address);
    //Return 0 if pair is not found
    if (!((_c = (_b = (_a = tokenPairResponse === null || tokenPairResponse === void 0 ? void 0 : tokenPairResponse.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.ethereum) === null || _c === void 0 ? void 0 : _c.dexTrades[0])) {
        return { base_price: 0, quote_price: 0 };
    }
    //Get token addresses from pair
    const { token0: { address: token0Address }, token1: { address: token1Address }, } = (_f = (_e = (_d = tokenPairResponse === null || tokenPairResponse === void 0 ? void 0 : tokenPairResponse.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.ethereum) === null || _f === void 0 ? void 0 : _f.dexTrades[0];
    let tokenAddress, pairedTokenAddress;
    //Determine the token & paired token
    if ([
        process.env.WETH_ADDR,
        process.env.DAI_ADDR,
        process.env.USDT_ADDR,
        process.env.USDC_ADDR,
    ].includes(String(token0Address).toLowerCase())) {
        tokenAddress = token1Address;
        pairedTokenAddress = token0Address;
    }
    else {
        tokenAddress = token0Address;
        pairedTokenAddress = token1Address;
    }
    //Get the price of the token
    const quotePriceResponse = yield (0, g_queries_1.G_QUERY_GetQuotePrice)(tokenAddress, pairedTokenAddress, timeBefore);
    //If no trades are found
    if (!quotePriceResponse || ((_j = (_h = (_g = quotePriceResponse === null || quotePriceResponse === void 0 ? void 0 : quotePriceResponse.data) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.ethereum) === null || _j === void 0 ? void 0 : _j.dexTrades) == null || ((_o = (_m = (_l = (_k = quotePriceResponse === null || quotePriceResponse === void 0 ? void 0 : quotePriceResponse.data) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.ethereum) === null || _m === void 0 ? void 0 : _m.dexTrades) === null || _o === void 0 ? void 0 : _o.length) == 0) {
        return { base_price: 0, quote_price: 0 };
    }
    const { quotePrice: basePrice } = (_r = (_q = (_p = quotePriceResponse === null || quotePriceResponse === void 0 ? void 0 : quotePriceResponse.data) === null || _p === void 0 ? void 0 : _p.data) === null || _q === void 0 ? void 0 : _q.ethereum) === null || _r === void 0 ? void 0 : _r.dexTrades[0];
    //If the paired tokens address is weth or dai (so not a stablecoin)
    if (String(pairedTokenAddress).toLowerCase() === process.env.WETH_ADDR ||
        String(pairedTokenAddress).toLowerCase() === process.env.DAI_ADDR) {
        const baseQuotePrice = basePrice;
        const baseCurrency = pairedTokenAddress;
        const quoteCurrency = pairedTokenAddress === process.env.WETH_ADDR
            ? process.env.USDC_ADDR
            : process.env.USDT_ADDR;
        const baseQuotePriceResponse = yield (0, g_queries_1.G_QUERY_GetQuotePrice)(baseCurrency, quoteCurrency, timeBefore);
        if (!baseQuotePriceResponse.data.data.ethereum.dexTrades[0]) {
            return { base_price: 0, quote_price: 0 };
        }
        const { quotePrice: quoteQuotePrice } = baseQuotePriceResponse.data.data.ethereum.dexTrades[0];
        return {
            base_price: baseQuotePrice * quoteQuotePrice,
            quote_price: quoteQuotePrice,
        };
    }
    return { base_price: basePrice, quote_price: 1 };
});
exports.getTokenPrice = getTokenPrice;
