import {
  OrderStatusEnum,
  OrderTypeEnum,
  PriceTypeEnum,
  RangeOrder,
  SingleOrder,
  UserOrder,
} from "@/types/token-order.type";

export const userOrder: Array<UserOrder> = [
  {
    id: "1",
    orders: [
      {
        id: 1,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.RANGE,
        prices: [5347.94, 3214, 9873.43],
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
      {
        id: 2,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.SINGLE,
        price: 3214,
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
    ],
  },
  {
    id: "2",
    orders: [
      {
        id: 3,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.SINGLE,
        price: 3214,
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
      {
        id: 4,
        budget: 2000,
        order_type: OrderTypeEnum.SELL,
        price_type: PriceTypeEnum.RANGE,
        prices: [5347.94, 3214, 9873.43],
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
    ],
  },
  {
    id: "3",
    orders: [
      {
        id: 3,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.SINGLE,
        price: 3214,
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
      {
        id: 4,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.RANGE,
        prices: [5347.94, 3214, 9873.43],
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
    ],
  },
  {
    id: "4",
    orders: [
      {
        id: 3,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.SINGLE,
        price: 3214,
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
      {
        id: 4,
        budget: 2000,
        order_type: OrderTypeEnum.SELL,
        price_type: PriceTypeEnum.RANGE,
        prices: [5347.94, 3214, 9873.43],
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
    ],
  },
  {
    id: "3",
    orders: [
      {
        id: 3,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.SINGLE,
        price: 3214,
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
      {
        id: 4,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.RANGE,
        prices: [5347.94, 3214, 9873.43],
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
    ],
  },
  {
    id: "4",
    orders: [
      {
        id: 3,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.SINGLE,
        price: 3214,
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
      {
        id: 4,
        budget: 2000,
        order_type: OrderTypeEnum.SELL,
        price_type: PriceTypeEnum.RANGE,
        prices: [5347.94, 3214, 9873.43],
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
    ],
  },
  {
    id: "3",
    orders: [
      {
        id: 3,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.SINGLE,
        price: 3214,
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
      {
        id: 4,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.RANGE,
        prices: [5347.94, 3214, 9873.43],
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
    ],
  },
  {
    id: "4",
    orders: [
      {
        id: 3,
        budget: 2000,
        order_type: OrderTypeEnum.BUY,
        price_type: PriceTypeEnum.SINGLE,
        price: 3214,
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
      {
        id: 4,
        budget: 2000,
        order_type: OrderTypeEnum.SELL,
        price_type: PriceTypeEnum.RANGE,
        prices: [5347.94, 3214, 9873.43],
        status: OrderStatusEnum.ACTIVE,
        baseTokenShortName: "Test", 
        baseTokenLongName: "Test", 
        pairTokenShortName: "Test", 
        pairTokenLongName: "Test",
        is_continuous: false
      },
    ],
  },
];
