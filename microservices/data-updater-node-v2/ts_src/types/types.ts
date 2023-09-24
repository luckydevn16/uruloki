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
};

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

export type Tokens = {
  topGainers: TopGainerItem[];
  topMovers: TopMoverItem[];
  mostBuyOrders: MostBuyOrder[];
  mostSellOrders: MostSellOrder[];
};