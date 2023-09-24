import { IMostSellOrder } from "@/global";
import { MostSellOrder } from "@/types";

export function MostSellOrdersMapper(objects: MostSellOrder[]):IMostSellOrder[] {
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
          sellOrders: item.sell_orders,
        }
      )
    );
  }