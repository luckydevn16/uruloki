import { ITopGainer } from "@/global";
import { TopGainerItem } from "@/types";

export function TopGainersMapper(objects: TopGainerItem[]): ITopGainer[] {
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
        price: item.token_cache.price!>0.1?Number(Number(item.token_cache.price).toFixed(2)):item.token_cache.price!>0.01?Number(Number(item.token_cache.price).toFixed(3)):item.token_cache.price!,
        risingPercent: Number(Number(item.token_cache.change_24hr).toFixed(2)),
      }
    ) 
  );
}
