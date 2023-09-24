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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenNamesFromPairN = exports.getTokenNamesFromPair = void 0;
const g_queries_1 = require("../g_queries");
const data_cache_1 = __importDefault(require("./caching/data-cache"));
/**
 * Server-Side
 * Gets the two token names from the provided pair address
 * @param pair_address
 * @returns
 */
function getTokenNamesFromPair(pair_address) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let tokenPairResponse;
        const cacheReq = yield data_cache_1.default.getIfFresh(`token-Pair:${pair_address}`);
        // Check if data is cached and still valid
        if (cacheReq.stale) {
            tokenPairResponse = (_a = (yield (0, g_queries_1.G_QUERY_GetTokenPair)(pair_address))) === null || _a === void 0 ? void 0 : _a.data;
            if (!tokenPairResponse.data.ethereum.dexTrades[0]) {
                return { success: false };
            }
            yield data_cache_1.default.addToCache(tokenPairResponse, `token-Pair:${pair_address}`, 60 * 60 * 24); //6hr ttl
        }
        else {
            tokenPairResponse = cacheReq.data.cached_data;
        }
        const { token0, token1 } = tokenPairResponse.data.ethereum.dexTrades[0];
        let baseToken, pairedToken;
        if ([
            process.env.WETH_ADDR,
            process.env.DAI_ADDR,
            process.env.USDT_ADDR,
            process.env.USDC_ADDR,
        ].includes(String(token0.address).toLowerCase())) {
            baseToken = token1;
            pairedToken = token0;
        }
        else {
            baseToken = token0;
            pairedToken = token1;
        }
        return {
            success: true,
            tokenPairInfo: {
                baseToken,
                pairedToken
            }
        };
    });
}
exports.getTokenNamesFromPair = getTokenNamesFromPair;
/**
 * Server-Side
 * Gets the two token names from the provided pair address. (Modified by Mykola)
 * @param pair_address
 * @returns
 */
function getTokenNamesFromPairN(pair_address) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const tokenPairResponse = yield (0, g_queries_1.G_QUERY_GetTokenPair)(pair_address);
        if (!((_a = tokenPairResponse.data.data.ethereum.dexTrades) === null || _a === void 0 ? void 0 : _a[0])) {
            return { success: false };
        }
        const { token0: baseToken, token1: pairedToken } = tokenPairResponse.data.data.ethereum.dexTrades[0];
        return {
            success: true,
            tokenPairInfo: {
                baseToken,
                pairedToken
            }
        };
    });
}
exports.getTokenNamesFromPairN = getTokenNamesFromPairN;
