import { Order, PatchOrder, PostOrder } from "@/types";
import { UserOrder } from "@/types/token-order.type";
import { httpRequest } from "./http";
import { TokenPriceInPair } from "@/types";
import axios from "axios";

export default class Orders {
  static getOrders = async (): Promise<Order> => {
    return await httpRequest.get("/orders");
  };

  static getOrderBooks = async (pair_address: string): Promise<any> => {
    return await httpRequest.get(`/orders/book/${pair_address}`);
  };

  static getOrderById = async (order_id: number): Promise<Order> => {
    return await httpRequest.get(`orders/${order_id}`);
  };
  static getOrdersbyUserId = async (userId: string): Promise<UserOrder[]> => {
    return await httpRequest.get(`/orders/user/${userId}`);
  };

  static getOrdersbyUserIdandFilters = async (
    userId: number,
    status: string,
    search: string,
    walletAddress: string
  ): Promise<UserOrder[]> => {
    return await httpRequest.get(
      `orders/user/${userId}?status=${status}&search=${search}&wallet_address=${walletAddress}`
    );
  };

  static getActiveOrdersbyTokenPair = async ({
    tokenpair,
    walletAddress,
  }: {
    tokenpair: string;
    walletAddress: string;
  }): Promise<Array<Order>> => {
    return await httpRequest.get(
      `/orders/tokenpair/${tokenpair}?status=active&wallet_address=${walletAddress}`
    );
  };

  static createOrder = async (data: PostOrder): Promise<Order[]> => {
    return await httpRequest.post("/orders", data);
  };
  static editOrder = async (
    orderId: number,
    data: PatchOrder
  ): Promise<Order> => {
    return await httpRequest.patch(`/orders/${orderId}`, data);
  };

  static cancelOrder = async (orderId: number): Promise<Order> => {
    return await httpRequest.delete(`/orders/${orderId}`);
  };

  static getTokenPriceInPair = async (
    pair_address: string
  ): Promise<number> => {
    return await httpRequest.post("/tokens/token-price", {
      pair_address,
      yesterday: false,
    });
  };

  static getYesterdayTokenPriceInPair = async (
    pair_address: string
  ): Promise<number> => {
    return await httpRequest.post("/tokens/token-price", {
      pair_address,
      yesterday: true,
    });
  };

  static getOrdersByWalletAddress = async (wallet_address: string): Promise<Array<Order>> => {
    const res = await axios.get(`/api/orders/user/${wallet_address}`)
    return res.data.payload ?? []
  }
}
