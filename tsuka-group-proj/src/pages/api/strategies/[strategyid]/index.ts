import type {
  ApiResponse,
  OrderStrategy,
  Strategy,
  StrategyStatusEnum,
} from "@/types";
import {
  OrderStatusEnum,
  RangeOrder,
  SingleOrder,
} from "@/types/token-order.type";
import { PrismaClient, order_strategy } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const reqBodySchema = Joi.object({
  name: Joi.string().optional(),
}).max(1);

const prisma = new PrismaClient();

export const getStrategy = async (strategyid: string) => {
  const orderIds = await prisma.order_strategy.findMany({
    where: {
      strategyId: Number(strategyid),
    },
  });
  const orderTokens = await prisma.orders.findMany({
    where: {
      order_id: {
        in: orderIds.map(({ orderId, ...rest }) => orderId),
      },
    },
  });
  let orders: any = {};
  for (const orderToken of orderTokens) {
    const sameOrders = await prisma.orders.findMany({
      where: {
        pair_address: orderToken.pair_address,
      },
    });
    orders[orderToken.order_id] = sameOrders.map((sameOrder) => ({
      id: sameOrder.order_id,
      budget: sameOrder.budget,
      price_type: sameOrder.price_type,
      order_type: sameOrder.order_type,
      status: sameOrder.status as OrderStatusEnum,
      baseTokenShortName: sameOrder.baseTokenShortName,
      baseTokenLongName: sameOrder.baseTokenLongName,
      pairTokenShortName: sameOrder.pairTokenShortName,
      pairTokenLongName: sameOrder.pairTokenLongName,
    }));
  }
  return { orders, orderTokens };
};

export default async function strategyHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Strategy>>
) {
  const { query, method, body } = req;
  const { strategyid } = query;

  switch (method) {
    case "DELETE":
      try {
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
          break;
        }
        const deletedStrategy = await prisma.strategies.delete({
          where: {
            strategy_id: Number(strategyid),
          },
        });
        const { orders, orderTokens } = await getStrategy(strategyid as string);
        await prisma.order_strategy.deleteMany({
          where: {
            strategyId: Number(strategyid),
          },
        });
        res.status(200).json({
          payload: {
            id: deletedStrategy.strategy_id.toString(),
            title: deletedStrategy.name as string,
            status: deletedStrategy.status as StrategyStatusEnum,
            createdAt: Math.round(
              (deletedStrategy.createdAt?.getTime() ?? 0) / 1000
            ).toString() as string,
            orderTokens: orderTokens.map((orderToken) => ({
              network: "Ethereum",
              name1: orderToken.baseTokenLongName as string,
              code1: orderToken.baseTokenShortName as string,
              name2: orderToken.pairTokenLongName as string,
              code2: orderToken.baseTokenShortName as string,
              status: orderToken.status as OrderStatusEnum,
              orders: orders[orderToken.order_id] as Array<
                SingleOrder | RangeOrder
              >,
            })),
          },
          message: `Successfully deleted strategy id ${strategyid}`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
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
          break;
        }
        const strategy = await prisma.strategies.update({
          where: {
            strategy_id: Number(strategyid),
          },
          data: value,
        });
        const { orders, orderTokens } = await getStrategy(strategyid as string);
        res.status(200).json({
          payload: {
            id: strategy.strategy_id.toString(),
            title: strategy.name as string,
            status: strategy.status as StrategyStatusEnum,
            createdAt: Math.round(
              (strategy.createdAt?.getTime() ?? 0) / 1000
            ).toString() as string,
            orderTokens: orderTokens.map((orderToken) => ({
              network: "Ethereum",
              name1: orderToken.baseTokenLongName as string,
              code1: orderToken.baseTokenShortName as string,
              name2: orderToken.pairTokenLongName as string,
              code2: orderToken.baseTokenShortName as string,
              status: orderToken.status as OrderStatusEnum,
              orders: orders[orderToken.order_id] as Array<
                SingleOrder | RangeOrder
              >,
            })),
          },
          message: `Successfully updated strategy id ${strategyid}`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["DELETE", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
