import { OrderStrategy, Strategy } from "@/types";
import axios from "axios";

export default class Strategies {
  static getStrategiesData = async (
    walletAddress: string
  ): Promise<Array<Strategy>> => {
    try {
      let data = await axios.get("/api/strategies", {
        params: {
          wallet_address: walletAddress,
        },
      });

      return data.data.payload;
    } catch (err) {
      return [];
    }
  };
  static getOrderStrategyData = async (id: number): Promise<OrderStrategy> => {
    console.log("this is id", id)
      let data = await axios.post(`/api/strategy`, { id });
      console.log("here is data", data)
      return data.data.payload;
  };
  static getStrategyData = async (id: string): Promise<Strategy> => {
    return await axios.get(`/api/strategies/${id}`);
  };
}
