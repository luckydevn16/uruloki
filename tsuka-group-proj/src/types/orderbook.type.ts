import { ModifiedOrder } from "@/lib/setups";
import { Order } from "./order.type";

export type OrderBookVolume = {
  price: number;
  size: number;
};

export class OrderBookData {
  buy: Array<OrderBookVolume> = [];
  sell: Array<OrderBookVolume> = [];

  getBuy(): Array<OrderBookVolume> {
    return this.buy;
  }

  getSell(): Array<OrderBookVolume> {
    return this.sell;
  }

  /**
   * Returns true if the buy array is already storing the given price
   * @param price
   * @returns
   */
  buyIncludes(price: number): boolean {
    return this.buy.filter((order) => order.price === price).length > 0;
  }

  /**
   * Returns true if the sell array is already storing the given price
   * @param price
   * @returns
   */
  sellIncludes(price: number): boolean {
    return this.sell.filter((order) => order.price === price).length > 0;
  }

  /**
   * Updates the stored volume (called size) at the given price, using the provided order size
   * @param price
   * @param orderSize
   * @param isSell
   */
  updateVolumeAtPrice(price: number, orderSize: number, isSell: boolean) {
    if (isSell) {
      if (this.sellIncludes(price)) {
        this.sell.filter((order) => order.price === price)[0].size += orderSize;
      } else {
        this.sell.push({ price, size: orderSize });
      }
    } else {
      if (this.buyIncludes(price)) {
        this.buy.filter((order) => order.price === price)[0].size += orderSize;
      } else {
        this.buy.push({ price, size: orderSize });
      }
    }
  }

  /**
   * Used for generating the data for the order book component. The component needs a single price for each order, so this function converts the order to a single price
   * @param order
   * @returns
   */
  static orderBookOrderToSinglePrice(order: ModifiedOrder): number {
    //If the order is a target price order (single), then the price is the single price. If it is a price range order, then the price is the from price if it is also a sell order
    if (order.price_type === "single") {
      return order.single_price ?? 0;
    } else if (order.order_type === "sell") {
      return order.from_price ?? 0;
    } else {
      return order.to_price ?? 0;
    }
  }

  /**
   * Resets the data in the current OrderBookData object, and then sets it to be calculated from the provided orders
   * @param all_orders
   * @returns
   */
  fromOrders(all_orders: ModifiedOrder[]) {
    //Only look at orders which are active
    const orders = all_orders.filter((a) => a.status === "Active");
    this.buy = [];
    this.sell = [];

    for (const order of orders) {
      const price = OrderBookData.orderBookOrderToSinglePrice(order);
      //const size = (order.budget as number) * (price as number); //This is the number of tokens that the order is for
      this.updateVolumeAtPrice(
        price,
        order.budget ?? 0,
        order.order_type === "sell"
      );
    }

    return this;
  }

  getBuySum(): number {
    return this.buy.reduce((acc, cur) => acc + cur.size, 0);
  }

  getSellSum(): number {
    return this.sell.reduce((acc, cur) => acc + cur.size, 0);
  }
}
