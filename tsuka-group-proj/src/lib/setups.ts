import {
  PrismaClient,
  orders_order_type,
  orders_price_type,
} from "@prisma/client";
import { StrategyStatusEnum } from "@/types";
import { orders as db_orders } from "@prisma/client";

export type ModifiedOrder = {
  id: number;
  pair_address: string;
  status: string | null;
  single_price: number | null;
  from_price: number | null;
  to_price: number | null;
  budget: number | null;
  order_type: orders_order_type | null;
  price_type: orders_price_type | null;
  is_continuous: boolean | null;
  user_id: number;
  baseTokenShortName: string | null;
  pairTokenShortName: string | null;
  baseTokenLongName: string | null;
  pairTokenLongName: string | null;

  price: number;
  prices: Array<number>;
};

export type TokenPairOrders = {
  network: string;
  name1: string;
  code1: string;
  name2: string;
  code2: string;
  pair_address: string;
  orders: Array<ModifiedOrder>;
};

export type Setup = {
  id: string;
  title: string;
  status: StrategyStatusEnum;
  createdAt: string;
  orderTokens: Array<TokenPairOrders>;
  creator_address: string;
};

export type GetSetupsResult = {
  setups: Array<Setup>;
};

export async function getSetups(): Promise<GetSetupsResult> {
  const prisma = new PrismaClient();

  //Query for all strategies, joined with the orders table
  const strategies = await prisma.strategies.findMany({
    include: {
      order_strategy: {
        select: {
          order: true,
        },
      },
    },
  });

  console.log("11111", strategies);

  //Parse orders out of query response
  let orders = new Map<number, Map<string, Array<db_orders>>>(); //Map<strategy_id, Map<pair_address, Array<order>>>
  for (const strategy of strategies) {
    const { order_strategy, strategy_id, ...rest } = strategy;
    for (const { order } of order_strategy) {
      if (!orders.has(strategy_id))
        orders.set(strategy_id, new Map<string, Array<db_orders>>());
      if (!orders.get(strategy_id)?.has(order.pair_address))
        orders.get(strategy_id)?.set(order.pair_address, []);
      orders.get(strategy_id)!.get(order.pair_address)!.push(order);
    }
  }

  let payload: GetSetupsResult = {
    setups: [],
  };

  strategies.forEach((strategy) => {
    const id = strategy.strategy_id.toString();
    const title = strategy.name as string;
    const status = strategy.status as StrategyStatusEnum;
    const creator_address = strategy.creator_address as string;
    const createdAt = Math.round(
      (strategy.createdAt?.getTime() ?? 0) / 1000
    ).toString() as string;

    const ordersInStrategy: Array<{
      pair_address: string;
      orders: Array<db_orders>;
    }> = []; //Relates a pair address to its orders

    //Loop over all orders within the setup, divided by pair_address
    if (orders.get(strategy.strategy_id))
      for (let [pair_address, orders_arr] of orders
        .get(strategy.strategy_id)!
        .entries()) {
        let orders_for_pair = orders
          .get(strategy.strategy_id)
          ?.get(pair_address);
        if (orders_for_pair) {
          //If there are orders for this pair
          if (
            ordersInStrategy.filter((a) => a.pair_address === pair_address)
              .length == 0
          ) {
            ordersInStrategy.push({
              pair_address,
              orders: orders_for_pair,
            });
          }
        }
      }

    const orderTokens = ordersInStrategy.map((pair) => {
      return {
        network: "Ethereum",
        name1: pair.orders[0].baseTokenLongName ?? "",
        code1: pair.orders[0].baseTokenShortName ?? "",
        name2: pair.orders[0].pairTokenLongName ?? "",
        code2: pair.orders[0].pairTokenShortName ?? "",
        pair_address: pair.pair_address,
        orders: pair.orders.map((order) => {
          return {
            ...order,
            id: order.order_id,
            price: order.single_price ?? 0,
            prices: [order.from_price ?? 0, order.to_price ?? 0],
          };
        }),
      };
    });

    payload.setups.push({
      id,
      title,
      status,
      createdAt,
      orderTokens,
      creator_address,
    });
  });

  return payload;
}
