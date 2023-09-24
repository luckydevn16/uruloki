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
exports.Etherscan = void 0;
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const ERC20_json_1 = __importDefault(require("../blockchain/abi/ERC20.json"));
class Etherscan {
    /**
     * Gets the fully diluted valuation of a token
     * @param contract_address The token contracts address. Not a pair address
     * @param latest_price The tokens latest price in usd
     * @returns The FDV in usd
     */
    static getFDV(contract_address, latest_price) {
        return __awaiter(this, void 0, void 0, function* () {
            //Use ethers to get number of decimals from token contract
            const provider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.PROVIDER_MAINNET_URL);
            const contract = new ethers_1.ethers.Contract(contract_address, ERC20_json_1.default.abi, provider);
            const decimals = yield contract.decimals();
            const totalSupply = yield contract.totalSupply();
            const url = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${contract_address}&apikey=${process.env.ETHERSCAN_API_KEY}`;
            const { data } = yield axios_1.default.get(url);
            if (data.status != 1)
                return 0;
            const supply = ethers_1.ethers.utils.formatUnits(totalSupply, decimals);
            const marketCap = Number(supply) * latest_price;
            return marketCap;
        });
    }
}
exports.Etherscan = Etherscan;
