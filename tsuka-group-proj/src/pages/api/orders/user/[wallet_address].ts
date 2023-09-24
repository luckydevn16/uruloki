import { getOrderByWalletAddress } from "@/lib/orders";
import type { ApiResponse, Order } from "@/types";
import { OrderStatusEnum, UserOrder } from "@/types/token-order.type";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function OrderByUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Order>>
) {
  const { query, method } = req;
  const { wallet_address } = query;
  switch (method) {
    case "GET":
      try {
        const orders = await getOrderByWalletAddress(wallet_address as string);
        res.status(200).json({
          payload: orders,
          message: `Successfully found orders`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
