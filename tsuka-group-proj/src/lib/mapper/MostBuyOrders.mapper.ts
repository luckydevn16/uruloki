import { IMostBuyOrder } from "@/global";
import { MostBuyOrder } from "@/types";

export function MostBuyOrdersMapper(objects: MostBuyOrder[]):IMostBuyOrder[] {
    return objects?.map((item) =>
      Object.assign(
        {}, 
        {
          rank: Number(item.rank),
          token: {
            id: String(item.token_cache.name),
            name: String(item.token_cache.name),
            shortName: String(item.token_cache.short_name),
            pair_address: String(item.token_cache.pair_address)
          },
          buyOrders: item.buy_orders,
        }
      )
    );
  }