import type { Order, OrdersBook, OrdersBookType } from "@/types";
import { OrderBookData } from "@/types/orderbook.type";
import { PrismaClient, orders } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Server-side function to get all orders for the provided pair address
 * @param pair_address
 * @param status
 * @returns
 */
export async function getOrdersByPair(
  pair_address: string,
  wallet_address: string,
  status?: string
): Promise<Array<Order>> {
  console.log("Pair address");
  console.log(pair_address);
  const whereCondition: any = { pair_address };
  if (status) {
    whereCondition["status"] = status;
  }
  if (wallet_address != "") {
    whereCondition.creator_address = wallet_address;
  }
  const orders = await prisma.orders.findMany({
    where: whereCondition,
  });
  return orders;
}

export async function getAllOrders(): Promise<Array<Order>> {
  const orders = await prisma.orders.findMany();
  return orders;
}

export type PairOrders = {
  pair_address: string;
  orders: Array<Order>;
};

export async function getOrdersByWalletAddress(
  wallet_address: string
): Promise<Array<PairOrders>> {
  const orders = await prisma.orders.findMany();

  let groupedOrders = new Map<string, Array<Order>>();
  let pairAddresses: Array<string> = [];
  orders.forEach((order) => {
    if (groupedOrders.has(order.pair_address)) {
      groupedOrders.get(order.pair_address)?.push(order);
    } else {
      groupedOrders.set(order.pair_address, [order]);
      pairAddresses.push(order.pair_address);
    }
  });

  let groupedOrdersArr: Array<PairOrders> = [];
  pairAddresses.forEach((pairAddress) => {
    if (groupedOrders.has(pairAddress))
      groupedOrdersArr.push({
        pair_address: pairAddress,
        orders: groupedOrders.get(pairAddress) as Order[],
      });
  });
  return groupedOrdersArr;
}

export async function getOrderByWalletAddress(
  wallet_address: string
): Promise<orders[]> {
  const orders = await prisma.orders.findMany({
    where: {
      creator_address: wallet_address,
    },
  });

  return orders;
}

export async function configureSetups(order_id: number, setup_ids: number[]) {
  //Delete order from existing setups
  await prisma.order_strategy.deleteMany({ where: { orderId: order_id } });

  //Add order to new set of setups
  await prisma.order_strategy.createMany({
    data: [
      ...setup_ids.map((setup_id) => {
        return {
          orderId: order_id,
          strategyId: setup_id,
        };
      }),
    ],
  });
}
