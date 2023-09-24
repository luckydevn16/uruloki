import type { ApiResponse, Order } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";

const reqBodySchema = Joi.object({
  pair_address: Joi.string().required(),
  status: Joi.string().optional().default("Active"),
  is_continuous: Joi.boolean().required().default(false),
  single_price: Joi.number().optional(),
  from_price: Joi.number().optional(),
  to_price: Joi.number().optional(),
  budget: Joi.number().required(),
  order_type: Joi.string().valid("buy", "sell").required(),
  price_type: Joi.string().valid("range", "single").required(),
  user_id: Joi.number().required(),
  creator_address: Joi.string().required(),
  baseTokenShortName: Joi.string().optional(),
  baseTokenLongName: Joi.string().optional(),
  pairTokenShortName: Joi.string().optional(),
  pairTokenLongName: Joi.string().optional(),
  selectedSetupId: Joi.number().optional(),
  order_strategy: Joi.object({
    id: Joi.number().required(),
    orderId: Joi.number().required(),
    strategyId: Joi.number().required(),
  }).optional(),
})
  .max(15)
  .min(7);

const prisma = new PrismaClient();

export default async function orderHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Order>>
) {
  const { method, body } = req;
  switch (method) {
    case "POST":
      try {
        const { value, error } = reqBodySchema.validate(body);
        console.log(value)
        if (error) {
          res.status(404).json({
            payload: undefined,
            message: `Validation Error: ${error.message}`,
          });
          break;
        }
        const str_id = value.selectedSetupId;
        delete value.selectedSetupId;
        const order = await prisma.orders.create({
          data: value,
        });
        const orderStrategy = {
          orderId: order.order_id,
          strategyId: str_id,
        };
        const result = await prisma.order_strategy.create({
          data: orderStrategy,
        });

        const order_update = await prisma.orders.findMany({
          where: {
            order_id: order.order_id,
          },
          include: {
               order_strategy: true
          },
        })
        console.log("this is order_update", order_update);
        res
          .status(200)
          .json({
            payload: order_update ? order_update : order,
            message: `Successfully created order`,
          });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    case "GET":
      try {
        const orders = await prisma.orders.findMany({});
        res
          .status(200)
          .json({ payload: orders, message: `Successfully found orders` });
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
