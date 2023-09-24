export enum OrderTypeEnum {
  BUY = "buy",
  SELL = "sell",
}
export enum PriceTypeEnum {
  SINGLE = "single",
  RANGE = "range",
}

export enum OrderStatusEnum {
  ACTIVE = "Active",
  EXECUTED = "Executed",
  CANCELLED = "Cancelled",
}

export interface Order {
  id: number;
  budget: number;
  price_type: PriceTypeEnum;
  order_type: OrderTypeEnum;
  status: OrderStatusEnum;
  is_continuous: boolean;
  baseTokenShortName: string;
  baseTokenLongName: string;
  pairTokenShortName: string;
  pairTokenLongName: string;
}

export interface SingleOrder extends Order {
  price: number;
}

export interface RangeOrder extends Order {
  prices: Array<number>;
}

export interface TokenOrder {
  name1: string;
  code1: string;
  name2: string;
  code2: string;
  status: OrderStatusEnum;
  orders: Array<SingleOrder | RangeOrder>;
  setShowEditOrderModal?: any;
  setShowDeletedAlert?: any;
}

export interface UserOrder {
  id: string;
  orders: Array<SingleOrder | RangeOrder>;
}
