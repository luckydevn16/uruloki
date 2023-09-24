import type { ApiResponse, TokenPairInfo } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { G_QUERY_GetTokenPair } from "./g_queries";
import { getTokenNamesFromPair } from "@/lib/token-pair";

export default async function tokenPriceInPairHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenPairInfo>>
) {
  const { query, method } = req;
  const { pair_address } = query;

  switch (method) {
    case "GET":
      let result;
      try {
        result = await getTokenNamesFromPair(pair_address as string);
      } catch (e) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${JSON.stringify(
            e
          )}'`,
        });
      }
      
      
      if (result && result.success && result.tokenPairInfo) {
        res.status(200).json({
          payload: {
            baseToken: result.tokenPairInfo.baseToken,
            pairedToken: result.tokenPairInfo.pairedToken,
          },
          message: `Successfully found price quote for pair address ${pair_address}`,
        });
      } else {
        console.log(result)
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong while fetching token names`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
