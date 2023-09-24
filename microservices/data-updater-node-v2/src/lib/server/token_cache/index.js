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
exports.upsertAndGetId = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function upsertAndGetId({ name, pair_address, price, change_24hr, volume, market_cap, address, short_name }) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Upserting ${name}...`);
        const itemExists = yield prisma.token_cache.findFirst({
            where: {
                pair_address
            }
        });
        const data = {
            name,
            chain: "ethereum",
            pair_address,
            price,
            change_24hr,
            volume: Math.round(volume),
            market_cap,
            last_updated: new Date(),
            address,
            short_name
        };
        if (itemExists != null) {
            yield prisma.token_cache.update({
                where: {
                    id: itemExists.id
                },
                data
            });
            return itemExists.id;
        }
        else {
            try {
                const createdItem = yield prisma.token_cache.create({ data });
                return createdItem.id;
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        }
    });
}
exports.upsertAndGetId = upsertAndGetId;
