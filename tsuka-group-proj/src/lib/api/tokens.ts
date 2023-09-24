import { TokenPairInfo, Tokens } from "@/types";

import { SearchPair } from "@/types";
import axios from "axios";
export default class HomePageTokens {
  static getTokens = async (): Promise<Tokens> => {
    return await axios.get(`/api/tokens`);
  };
  static searchTokens = async (name: string): Promise<SearchPair[]> => {
    const res = await axios.get(`/api/search/addresses?name=${name}`);
    return res.data;
  };
  static getTokensWithPotentialBalance = async (walletAddress: string): Promise<Array<string>> => {
    const res = await axios.get(`/api/tokens/balances/${walletAddress}`)
    console.log(res.data.payload)
    return res.data.payload
  }
  static getTokenPairInfo = async (
    pair_address: string
  ): Promise<TokenPairInfo> => {
    const a = await axios.get(`/api/tokens/token-pair?pair_address=${pair_address}`);
    console.log(a.data.payload);
    return a.data?.payload as TokenPairInfo;
  };
  static getTokenVolume = async (
    baseTokenAddress: string
  ): Promise<{ tradeAmount: number }> => {
    const response = await axios.get(`/api/tokens/token-volume?baseTokenAddress=${baseTokenAddress}`);
    if(response?.status == 200) {
      return response.data.payload;
    } else {
      console.log("Error getting token volume")
      return {
        tradeAmount: 0
      }
    }
  };
}
