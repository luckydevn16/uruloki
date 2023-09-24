import { PairOrders, getOrdersByWalletAddress } from "@/lib/orders";
import { getTokenNamesFromPair } from "@/lib/token-pair";

/**
 * Queries the db to find all pair addresses that hte user has created orders for
 * @param walletAddress 
 * @returns An array of token addresses which the user may have a balance for
 */
export async function getTokensWithPotentialBalance(walletAddress: string): Promise<Array<string>> {
    const orders = await getOrdersByWalletAddress(walletAddress)
    //console.log(orders)
    
    //Get the list of pair addresses for the orders
    let pairAddresses: Array<string> = []
    orders.map((order: PairOrders) => {
        if(order.pair_address && !pairAddresses.includes(order.pair_address)) pairAddresses.push(order.pair_address)
    })

    let tokenAddresses: Array<string> = []
    //Convert this to a list of token addresses
    for(let address of pairAddresses) {
        const tokenPairInfo = await getTokenNamesFromPair(address)
        if(tokenPairInfo.success) {
            const baseAddress = tokenPairInfo.tokenPairInfo?.baseToken?.address
            if(baseAddress && !tokenAddresses.includes(baseAddress.toLowerCase()) && baseAddress != "-") tokenAddresses.push(baseAddress.toLowerCase())

            const pairedAddress = tokenPairInfo.tokenPairInfo?.pairedToken?.address
            if(pairedAddress && !tokenAddresses.includes(pairedAddress.toLowerCase()) && baseAddress != "-") tokenAddresses.push(pairedAddress.toLowerCase())
        } else {
            console.log("Unable to get tokenPairInfo for " + address)
        }
    }

    return tokenAddresses
}