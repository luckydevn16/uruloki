import { TokenCache } from "@/types";
import { httpRequest } from "./http";
import { FilterSearchItemType } from "@/components/ui/content-header/filters.search";

export default class TokenCacheData {
//   static getAllTokenName = async (): Promise<TokenCache> => {
//     return await httpRequest.get("/tokencache");
//   };
  static getAllTokenName = async (): Promise<TokenCache[]> => {
    return await httpRequest.get("/tokencache");
  };
}
