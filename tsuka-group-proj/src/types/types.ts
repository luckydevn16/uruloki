export type ApiResponse<T> = {
  payload: Array<T> | T | undefined;
  message: string;
};

export type OrderBookResponse<T> = {
  payload:
    | {
        sell: Array<T> | T | undefined;
        buy: Array<T> | T | undefined;
      }
    | undefined;
  message: string;
};

export type Notification = {
  notification_id: number;
  user_id: number;
  text: string | null;
  date: Date | null;
};

export type TopGainerItem = {
  id: number;
  rank: number | null;
  token_cache_id: number;
  token_cache: {
    name: string | null;
    price: number | null;
    chain: string | null;
    short_name: string | null;
    change_24hr: number | null;
    pair_address: string | null;
  };
};

export type TopMoverItem = {
  id: number;
  rank: number | null;
  token_cache_id: number;
  token_cache: {
    id: number;
    name: string | null;
    chain: string | null;
    pair_address: string;
    price: number | null;
    change_24hr: number | null;
    address: string | null;
    short_name: string | null;
    volume: number | null;
    market_cap: number | null;
  };
} & OrderDetails;

export type MostBuyOrder = {
  id: number;
  rank: number | null;
  token_cache_id: number;
  token_cache: {
    name: string | null;
    chain: string | null;
    short_name: string | null;
    pair_address: string | null;
  };
  buy_orders: number;
  total_orders: number;
} 

export type MostSellOrder = {
  id: number;
  rank: number | null;
  token_cache_id: number;
  token_cache: {
    name: string | null;
    chain: string | null;
    short_name: string | null;
    pair_address: string | null;
  };
  sell_orders: number;
  total_orders: number;
}

type OrderDetails = {
  buy_orders: number;
  sell_orders: number;
  total_orders: number;
};

export type Tokens = {
  topGainers: TopGainerItem[];
  topMovers: TopMoverItem[];
  mostBuyOrders: MostBuyOrder[];
  mostSellOrders: MostSellOrder[];
};

export type DropdownOption = {
  title : string,
  label : string
}
export type DropdownsetUpOption = {
  label : string
  code1 : string,
  code2 : string
  value : number
}