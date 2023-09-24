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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DataCache {
}
_a = DataCache;
/**
 * Reads the cached data for "data_key" from the cache if it is not stale
 * @param data_key
 * @returns
 */
DataCache.getIfFresh = (data_key) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield prisma.cache.findFirst({ where: { data_key } });
    if (result) {
        let deadline = result.timestamp + result.ttl;
        let currentTime = Math.floor(Date.now() / 1000);
        if (deadline >= currentTime) {
            return {
                stale: false,
                data: {
                    data_key: result === null || result === void 0 ? void 0 : result.data_key,
                    cached_data: JSON.parse(result === null || result === void 0 ? void 0 : result.cached_data)
                }
            };
        }
        else {
            return {
                stale: true,
                data: {
                    data_key: '',
                    cached_data: {}
                }
            };
        }
    }
    else {
        return {
            stale: true,
            data: {
                data_key: '',
                cached_data: {}
            }
        };
    }
});
/**
 * Adds the supplied data to the cache, overwriting any other item in the cache with the same key
 * @param data
 * @param key
 * @param ttl (seconds)
 */
DataCache.addToCache = (data, key, ttl) => __awaiter(void 0, void 0, void 0, function* () {
    let currentTime = Math.floor(Date.now() / 1000);
    yield prisma.cache.deleteMany({ where: { data_key: key } });
    yield prisma.cache.create({
        data: {
            timestamp: currentTime,
            cached_data: JSON.stringify(data),
            data_key: key,
            ttl: ttl
        }
    });
});
exports.default = DataCache;
