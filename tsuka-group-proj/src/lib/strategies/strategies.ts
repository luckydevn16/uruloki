import { Strategy, StrategyStatusEnum } from "@/types";
import { OrderStatusEnum } from "@/types/token-order.type";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

export namespace Strategies {
  export class Server {
    static async getStrategiesData(wallet_address: string): Promise<Array<Strategy>> {
      const prisma = new PrismaClient()
      //Read strategies from db
      const allStrategies = await prisma.strategies.findMany({
        where: {
          creator_address: wallet_address,
        }
      });

      const strategies = await prisma.strategies.findMany({
        where: {
          creator_address: wallet_address,
        },
        include: {
          order_strategy: {
            select: {
              order: true,
            },
          },
        },
      });

      let orders: any = {};

      //Loop over each strategy
      for (const strategy of strategies) {
        const { order_strategy, strategy_id, ...rest } = strategy;

        //Loop over each order within the strategy
        for (const { order } of order_strategy) {
          if (!orders[strategy_id]) orders[strategy_id] = {}; //If no orders are currently stored for this strategy initialize the object
          if (orders[strategy_id][order.pair_address]) { //If orders for this strategy and pair address are already tracked then just push to the array
            orders[strategy_id][order.pair_address].push(order);
          } else {
            orders[strategy_id][order.pair_address] = [order]; //If no orders are currently stored for this pair initialize the array
          }
        }
      }

      //Bring eveyrthing together into the final datastructure
      const payload = strategies.map((strategy) => ({
        id: strategy.strategy_id.toString(),
        title: strategy.name as string,
        status: strategy.status as StrategyStatusEnum,
        createdAt: Math.round(
          (strategy.createdAt?.getTime() ?? 0) / 1000
        ).toString() as string,
        orderTokens: orders[strategy.strategy_id]
          ? Object.keys(orders[strategy.strategy_id]).map((pair_address) => ({
              network: "Ethereum",
              name1: orders[strategy.strategy_id][pair_address][0]
                .baseTokenLongName as string,
              code1: orders[strategy.strategy_id][pair_address][0]
                .baseTokenShortName as string,
              name2: orders[strategy.strategy_id][pair_address][0]
                .pairTokenLongName as string,
              code2: orders[strategy.strategy_id][pair_address][0]
                .pairTokenShortName as string,
              status: orders[strategy.strategy_id][pair_address][0]
                .status as OrderStatusEnum,
              orders: orders[strategy.strategy_id][pair_address].map(
                (order: any) => ({
                  id: order.order_id,
                  budget: order.budget,
                  price_type: order.price_type,
                  order_type: order.order_type,
                  status: order.status,
                  baseTokenShortName: order.baseTokenShortName,
                  baseTokenLongName: order.baseTokenLongName,
                  pairTokenShortName: order.pairTokenShortName,
                  pairTokenLongName: order.pairTokenLongName,
                  price: order.single_price,
                  prices: [order.from_price, order.to_price],
                })
              ),
            }))
          : [],
      }));

      return payload
    }
    static async getStrategyData(id: number): Promise<Array<any>> {
      const prisma = new PrismaClient()
      //Read strategies from db
      const allStrategies = await prisma.order_strategy.findMany({
        where: {
          strategyId: id,
        }
      });
      
      return allStrategies;
    }
  }
    
  export class Client {
    static async getStrategiesData(wallet_address: string): Promise<Array<Strategy>> {
      const {data} = await axios.get(`/api/strategies?wallet_address=${wallet_address}`)
      let strategies = data.payload
      strategies = strategies.map((strategy: any) => {
        return {
          id:strategy.id,
          title: strategy.title ?? "",
          status: strategy.status ?? StrategyStatusEnum.ACTIVE,
          createdAt: strategy.createdAt ?? Math.round((new Date().getTime() ?? 0)).toString(),
          orderTokens: strategy.orderTokens ?? []
        }
      })
      // return data.payload
      return strategies;
    }
  }
}
