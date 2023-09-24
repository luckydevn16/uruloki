import axios from "axios"
import { ethers } from "ethers"
import ERC20 from "../../blockchain/abi/ERC20.json"

export class Etherscan {
    /**
     * Gets the fully diluted valuation of a token
     * @param contract_address The token contracts address. Not a pair address
     * @param latest_price The tokens latest price in usd
     * @returns The FDV in usd
     */
    static async getFDV(contract_address: string, latest_price: number): Promise<number> {
        //Use ethers to get number of decimals from token contract
        const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_MAINNET_URL)
        const contract = new ethers.Contract(contract_address, ERC20.abi, provider)
        const decimals = await contract.decimals()
        const totalSupply = await contract.totalSupply()

        const url = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${contract_address}&apikey=${process.env.ETHERSCAN_API_KEY}`
        const {data} = await axios.get(url)
        if(data.status != 1) return 0

        const supply = ethers.utils.formatUnits(totalSupply, decimals)
        const marketCap = Number(supply) * latest_price
        return marketCap
    }
}