import { getTokensWithPotentialBalance } from "@/lib/server/tokens/balances";
import type { ApiResponse } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function OrderByUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<string[]>>
) {
  const { query, method } = req;
  const { wallet_address } = query;
  switch (method) {
    case "GET":
      try {
        const tokenAddresses = await getTokensWithPotentialBalance(wallet_address as string);
        res.status(200).json({
          payload: tokenAddresses,
          message: `Successfully found orders`,
        });
      } catch (err) {
        res.status(500).json({
          payload: [],
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
