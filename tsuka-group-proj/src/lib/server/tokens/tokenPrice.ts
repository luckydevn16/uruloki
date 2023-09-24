import { G_QUERY_GetQuotePrice } from "@/pages/api/tokens/g_queries";
import { getTokenNamesFromPair } from "../../token-pair";

export type GetTokenPriceResult = {
    success: boolean,
    message?: string,
    price?: number
}

export default async function getTokenPrice(pair_address: string, yesterday: boolean): Promise<GetTokenPriceResult> {
    const time_before = (
        yesterday
        ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        : new Date()
    ).toISOString();

    const pair_find_result = await getTokenNamesFromPair(pair_address); /* Find token pair from pair_address */

    if(pair_find_result.success !== true) {
        return {
            message: `Pair address ${pair_address} not found`,
            success: false
        }
    }

    const pair_base_address: string = pair_find_result.tokenPairInfo?.baseToken?.address!;
    const pair_quote_address: string = pair_find_result.tokenPairInfo?.pairedToken?.address!;

    if(!is_valid_token(pair_base_address, pair_quote_address)) {
        return {
            success: false,
            message: `Invalid token pair ${pair_address}`,
        }       
    }

    const pair_price_result = await G_QUERY_GetQuotePrice(pair_base_address, pair_quote_address, time_before); /* get price rate of base_token / quote_token */
    if (!pair_price_result.data.data.ethereum.dexTrades?.[0]) {
        return {
            success: false,
            message: `Transaction for ${pair_address} not found`,
        }
    }

    if(is_usdt_or_usdc(pair_find_result.tokenPairInfo?.baseToken?.address ?? "")) { //If the base token is usdt or usdc
        return {
            price: pair_price_result.data.data.ethereum.dexTrades[0].quotePrice,
            message: `Successfully found price quote for pair address ${pair_address}`,
            success: true
        }
    } else if (is_usdt_or_usdc(pair_find_result.tokenPairInfo?.pairedToken?.address ?? "")) { //If the paired token is usdt or usdc
        return {
            price: pair_price_result.data.data.ethereum.dexTrades[0].basePrice,
            message: `Successfully found price quote for pair address ${pair_address}`,
            success: true
        }
    } else { //If the base token is the "paired token", then get the price of the other token
        const base2usd_price = await get_price_base2usd(pair_quote_address, time_before);
        if(base2usd_price) { /* Case of there is transaction pair base_token / USDT or base_token/USTC */
            return {
                price: base2usd_price * pair_price_result.data.data.ethereum.dexTrades[0].quotePrice,
                message: `Successfully found price quote for pair address ${pair_address}`,
                success: true
            }
        } else { /* Else Use intermediate token */
            const quote2usd_price = await get_price_base2usd(pair_quote_address, time_before);
            return {
                price: quote2usd_price / pair_price_result.data.data.ethereum.dexTrades[0].quotePrice,
                message: `Successfully found price quote for pair address ${pair_address}`,
                success: true
            }
        }
    }
}

export function is_valid_token(base_token: string, quote_token: string) {
    return base_token.startsWith("0x") && quote_token.startsWith("0x");
}

export function is_usdt_or_usdc(token_address: string) {
    return token_address === process.env.USDT_ADDR || token_address === process.env.USDC_ADDR;
}

export async function get_price_base2usd(base_address: string, time_before: string) {
    const usdt_price_result = await G_QUERY_GetQuotePrice(base_address, process.env.USDT_ADDR!, time_before);
    if(usdt_price_result.data.data.ethereum.dexTrades?.[0]) {
      return usdt_price_result.data.data.ethereum.dexTrades?.[0]?.quotePrice;
    } else {
      const usdc_price_result = await G_QUERY_GetQuotePrice(base_address, process.env.USDC_ADDR!, time_before);
      return usdc_price_result.data.data.ethereum.dexTrades?.[0]?.quotePrice;
    }
}