import type { ApiResponse, OrderStrategy } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const reqBodySchema = Joi.object({
  order_id: Joi.string().required(),
});

const prisma = new PrismaClient();

export default async function strategyHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<OrderStrategy>>
) {
  const { query, method, body } = req;
  const { strategyid } = query;

  switch (method) {
    case "PATCH":
      try {
        const { value, error } = reqBodySchema.validate(body);
        if (error) {
          res.status(404).json({
            payload: undefined,
            message: `Validation Error: ${error.message}`,
          });
          break;
        }
        const strategyExist = await prisma.strategies.findFirst({
          where: {
            strategy_id: Number(strategyid),
          },
        });
        if (!strategyExist) {
          res.status(404).json({
            payload: undefined,
            message: `setup id ${strategyid} not found!`,
          });
          return;
        }
        const { order_id } = value;
        const orderExist = await prisma.order_strategy.findFirst({
          where: {
            strategyId: Number(strategyid),
            orderId: Number(order_id),
          },
        });
        if (!orderExist) {
          res.status(404).json({
            payload: undefined,
            message: `setup ${strategyExist.name} hasn't got a order id ${order_id}!`,
          });
          return;
        }
        const deleteOrder = await prisma.order_strategy.delete({
          where: {
            id: orderExist.id,
          },
        });
        res.status(200).json({
          payload: deleteOrder,
          message: `Successfully deleted setup id ${strategyid}`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
