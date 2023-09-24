import type { TokenPairInfo } from "../types";
import { G_QUERY_GetTokenPair } from "../g_queries";
import DataCache from './caching/data-cache';

export type TokenPairInfoResult = {
  success: boolean;
  tokenPairInfo?: TokenPairInfo;
}

/**
 * Server-Side
 * Gets the two token names from the provided pair address
 * @param pair_address  
 * @returns 
 */
export async function getTokenNamesFromPair(pair_address: string): Promise<TokenPairInfoResult> {
  let tokenPairResponse: any
  const cacheReq = await DataCache.getIfFresh(`token-Pair:${pair_address}`);
  // Check if data is cached and still valid
  if (cacheReq.stale) {
    tokenPairResponse = (await G_QUERY_GetTokenPair(
      pair_address as string
    ))?.data;
    if (!tokenPairResponse.data.ethereum.dexTrades[0]) {
      return { success: false }
    }
    await DataCache.addToCache(tokenPairResponse, `token-Pair:${pair_address}`, 60 * 60 * 24); //6hr ttl
  } else {
    tokenPairResponse = cacheReq.data.cached_data
  }
  const { token0, token1 } = tokenPairResponse.data.ethereum.dexTrades[0];
  let baseToken, pairedToken;
  if (
    [
      process.env.WETH_ADDR,
      process.env.DAI_ADDR,
      process.env.USDT_ADDR,
      process.env.USDC_ADDR,
    ].includes(String(token0.address).toLowerCase())
  ) {
    baseToken = token1;
    pairedToken = token0;
  } else {
    baseToken = token0;
    pairedToken = token1;
  }

  return {
    success: true,
    tokenPairInfo: {
      baseToken,
      pairedToken
    }
  }
}

/**
 * Server-Side
 * Gets the two token names from the provided pair address. (Modified by Mykola)
 * @param pair_address 
 * @returns 
 */
export async function getTokenNamesFromPairN(pair_address: string): Promise<TokenPairInfoResult> {
    const tokenPairResponse = await G_QUERY_GetTokenPair(
        pair_address as string
    );
    
    if (!tokenPairResponse.data.data.ethereum.dexTrades?.[0]) {
        return {success: false}
    }

    const { token0: baseToken, token1: pairedToken } = tokenPairResponse.data.data.ethereum.dexTrades[0];

    return {
        success: true,
        tokenPairInfo: {
            baseToken,
            pairedToken
        }
    }
}
