import type { ApiResponse, TokenPriceInPair } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenPrice } from "@/lib/token-price";

export default async function tokenPriceInPairHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenPriceInPair>>
) {
  const { method, body } = req;

  switch (method) {
    case "POST":
        const price = await getTokenPrice(body.pair_address, false)
        res.status(200).json({
            payload: price,
            message: "Success"
        });
        return;
    default:
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
  }
}