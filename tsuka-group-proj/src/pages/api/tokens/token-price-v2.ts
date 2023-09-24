import type { ApiResponse, TokenPriceInPair } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenPrice } from "@/lib/token-price";
import DataCache from '@/lib/caching/data-cache';

export default async function tokenPriceInPairHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenPriceInPair>>
) {
  const { body } = req;
  let statusCode = -1;
  try {
    const { pair_address, yesterday } = body;

    let data;
    const ttl = 60 * 15 //15 min
    const key = `token-price:${pair_address}:${yesterday}`
    const cacheReq = await DataCache.getIfFresh(key);
    statusCode = 1; // DataCache If Fresh passed
    
    if(cacheReq.stale) {
      data = await getTokenPrice(pair_address, yesterday)
      statusCode = 2; // Get Token Price passed
      await DataCache.addToCache(data, key, ttl);
      statusCode = 3; // Add To Cache passed
    } else {
      data = cacheReq.data.cached_data
    }

    res.status(200).json({
        payload: data,
        message: "success"
    })

  } catch (err) {
    console.log(err);
    res.status(400).json({
      payload: undefined,
      message: `Something went wrong! StatusCode: ${statusCode}. Please read the error message '${JSON.stringify(err)}'`,
    });
  }
}