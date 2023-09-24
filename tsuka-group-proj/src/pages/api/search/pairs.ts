/** route example: api/search/pairs?token0=0xdac17f958d2ee523a2206206994597c13d831ec7 */

import type { ApiResponse, SearchPair } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getPairsByTokenAddress } from "@/services/search-services";

export default async function searchPairHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SearchPair>>
) {
  const { method, query } = req;
  switch (method) {
    case "GET":
      try {
        // const orders = await prisma.orders.findMany({});
        let token0 = query.token0 as string;
        const pairs = await getPairsByTokenAddress(token0);
        if (pairs.length === 0) {
          res.status(404).json({
            payload: undefined,
            message: `No pairs found with token address ${token0}`,
          });
        } else {
          res
            .status(200)
            .json({ payload: pairs, message: `Successfully found pairs` });
        }
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
