import type { ApiResponse, OrderStrategy } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const reqBodySchema = Joi.object({
  orders: Joi.array().required(),
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
            message: `Setup id ${strategyid} not found!`,
          });
          return;
        }
        const { orders } = value;
        const orderStrategies = orders.map((order: number[]) => ({
          orderId: order,
          strategyId: strategyExist.strategy_id,
        }));
        console.log(orderStrategies);
        await prisma.order_strategy.createMany({
          data: orderStrategies,
          skipDuplicates: false,
        });
        console.log("created");
        const orderStrategiesCreated = await prisma.order_strategy.findMany({
          where: {
            strategyId: Number(strategyExist.strategy_id),
          },
        });
        res.status(200).json({
          payload: orderStrategiesCreated,
          message: `Successfully added orders to setup id ${strategyid}`,
        });
      } catch (err: any) {
        if (err.code == "P2002") {
          res.status(400).json({
            payload: undefined,
            message: "Duplicate record(s) found",
          });
          return;
        }
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${JSON.stringify(
            err
          )}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
