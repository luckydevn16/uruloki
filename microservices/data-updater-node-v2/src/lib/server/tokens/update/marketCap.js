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
exports.updateTokenCacheMarketCap = void 0;
const etherscan_1 = require("../../../etherscan/etherscan");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function updateTokenCacheMarketCap() {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenCacheTokens = yield prisma.token_cache.findMany({});
        for (let token of tokenCacheTokens) {
            console.log(`Updating market cap for ${token.short_name}`);
            try {
                if (token.address && token.price) {
                    const marketCap = yield etherscan_1.Etherscan.getFDV(token.address, token.price);
                    console.log(marketCap.toLocaleString("en-us", { maximumFractionDigits: 2 }));
                    yield prisma.token_cache.update({
                        where: {
                            id: token.id
                        },
                        data: {
                            market_cap: marketCap
                        }
                    });
                }
            }
            catch (e) {
                console.log(`Unable to get market cap for ${token.short_name}`);
                console.log(e);
            }
        }
        return {
            success: true,
            message: "Successfully updated market cap"
        };
    });
}
exports.updateTokenCacheMarketCap = updateTokenCacheMarketCap;
