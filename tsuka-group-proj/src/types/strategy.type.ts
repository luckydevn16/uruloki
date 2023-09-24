import { OrderStatusEnum, RangeOrder, SingleOrder } from "./token-order.type";

export enum StrategyStatusEnum {
  ACTIVE = "Active",
  EXECUTED = "Executed",
  CANCELLED = "Cancelled",
}

export type OrderToken = {
  network: string;
  name1: string;
  code1: string;
  name2: string;
  code2: string;
  extraTokens?: Array<{
    name: string;
    code: string;
  }>;
  status: OrderStatusEnum;
  orders: Array<SingleOrder | RangeOrder>;
};

export type Strategy = {
  id: string;
  title: string;
  status: StrategyStatusEnum;
  createdAt: string;
  orderTokens: Array<OrderToken>;
};
