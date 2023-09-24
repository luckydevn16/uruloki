import type { OrderBookResponse, OrdersBook, OrdersBookType } from "@/types";
import { Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function orderHandler(
  req: NextApiRequest,
  res: NextApiResponse<OrderBookResponse<OrdersBook>>
) {
  const { query, method } = req;
  const { pair_address } = query;
  switch (method) {
    case "GET":
      try {
        const orders = await prisma.orders.findMany({
          select: {
            single_price: true,
            from_price: true,
            to_price: true,
            budget: true,
            price_type: true,
            order_type: true,
          },
          where: {
            pair_address: pair_address as string,
            status: "Active",
          },
        });

        const groupedSellOrders: OrdersBookType = {};
        const groupedBuyOrders: OrdersBookType = {};

        for (const order of orders) {
          const price =
            order.price_type === "single"
              ? order.single_price
              : order.order_type === "sell"
              ? order.from_price
              : order.to_price;
          const size = (order.budget as number) * (price as number);

          if (order.order_type === "sell") {
            if (groupedSellOrders[price ?? ""]) {
              groupedSellOrders[price ?? ""].size += size;
            } else {
              groupedSellOrders[price ?? ""] = { price: price as number, size };
            }
          } else if (order.order_type === "buy") {
            if (groupedBuyOrders[price ?? ""]) {
              groupedBuyOrders[price ?? ""].size += size;
            } else {
              groupedBuyOrders[price ?? ""] = { price: price as number, size };
            }
          }
        }

        res.status(200).json({
          payload: {
            sell: Object.values(groupedSellOrders),
            buy: Object.values(groupedBuyOrders),
          },
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
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
