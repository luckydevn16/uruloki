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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategies = void 0;
const types_1 = require("../../types");
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
var Strategies;
(function (Strategies) {
    class Server {
        static getStrategiesData(wallet_address) {
            return __awaiter(this, void 0, void 0, function* () {
                const prisma = new client_1.PrismaClient();
                //Read strategies from db
                const allStrategies = yield prisma.strategies.findMany({
                    where: {
                        creator_address: wallet_address,
                    }
                });
                const strategies = yield prisma.strategies.findMany({
                    where: {
                        creator_address: wallet_address,
                    },
                    include: {
                        order_strategy: {
                            select: {
                                order: true,
                            },
                        },
                    },
                });
                let orders = {};
                //Loop over each strategy
                for (const strategy of strategies) {
                    const { order_strategy, strategy_id } = strategy, rest = __rest(strategy, ["order_strategy", "strategy_id"]);
                    //Loop over each order within the strategy
                    for (const { order } of order_strategy) {
                        if (!orders[strategy_id])
                            orders[strategy_id] = {}; //If no orders are currently stored for this strategy initialize the object
                        if (orders[strategy_id][order.pair_address]) { //If orders for this strategy and pair address are already tracked then just push to the array
                            orders[strategy_id][order.pair_address].push(order);
                        }
                        else {
                            orders[strategy_id][order.pair_address] = [order]; //If no orders are currently stored for this pair initialize the array
                        }
                    }
                }
                //Bring eveyrthing together into the final datastructure
                const payload = strategies.map((strategy) => {
                    var _a, _b;
                    return ({
                        id: strategy.strategy_id.toString(),
                        title: strategy.name,
                        status: strategy.status,
                        createdAt: Math.round(((_b = (_a = strategy.createdAt) === null || _a === void 0 ? void 0 : _a.getTime()) !== null && _b !== void 0 ? _b : 0) / 1000).toString(),
                        orderTokens: orders[strategy.strategy_id]
                            ? Object.keys(orders[strategy.strategy_id]).map((pair_address) => ({
                                network: "Ethereum",
                                name1: orders[strategy.strategy_id][pair_address][0]
                                    .baseTokenLongName,
                                code1: orders[strategy.strategy_id][pair_address][0]
                                    .baseTokenShortName,
                                name2: orders[strategy.strategy_id][pair_address][0]
                                    .pairTokenLongName,
                                code2: orders[strategy.strategy_id][pair_address][0]
                                    .pairTokenShortName,
                                status: orders[strategy.strategy_id][pair_address][0]
                                    .status,
                                orders: orders[strategy.strategy_id][pair_address].map((order) => ({
                                    id: order.order_id,
                                    budget: order.budget,
                                    price_type: order.price_type,
                                    order_type: order.order_type,
                                    status: order.status,
                                    baseTokenShortName: order.baseTokenShortName,
                                    baseTokenLongName: order.baseTokenLongName,
                                    pairTokenShortName: order.pairTokenShortName,
                                    pairTokenLongName: order.pairTokenLongName,
                                    price: order.single_price,
                                    prices: [order.from_price, order.to_price],
                                })),
                            }))
                            : [],
                    });
                });
                return payload;
            });
        }
    }
    Strategies.Server = Server;
    class Client {
        static getStrategiesData(wallet_address) {
            return __awaiter(this, void 0, void 0, function* () {
                const { data } = yield axios_1.default.get(`api/strategies?wallet_address=${wallet_address}`);
                let strategies = data.payload;
                strategies = strategies.map((strategy) => {
                    var _a, _b, _c, _d, _e;
                    return {
                        id: strategy.id,
                        title: (_a = strategy.title) !== null && _a !== void 0 ? _a : "",
                        status: (_b = strategy.status) !== null && _b !== void 0 ? _b : types_1.StrategyStatusEnum.ACTIVE,
                        createdAt: (_c = strategy.createdAt) !== null && _c !== void 0 ? _c : Math.round(((_d = new Date().getTime()) !== null && _d !== void 0 ? _d : 0)).toString(),
                        orderTokens: (_e = strategy.orderTokens) !== null && _e !== void 0 ? _e : []
                    };
                });
                // return data.payload
                return strategies;
            });
        }
    }
    Strategies.Client = Client;
})(Strategies || (exports.Strategies = Strategies = {}));
