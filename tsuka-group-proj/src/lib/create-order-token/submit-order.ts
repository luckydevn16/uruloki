import { Order, PatchOrder, PostOrder, OrderStrategy, TokenPairInfo } from "@/types";
import { toNumber } from "../number-helpers";
import Orders from "../api/orders";
import { useUrulokiAPI } from "@/blockchain";
import { setUncaughtExceptionCaptureCallback } from "process";

export type CreateOrderPriceInfoProps = {
  minPrice: string;
  maxPrice: string;
  targetPrice: string;
  name1: string;
  name2: string;
  pair_address: string;
};

export const createOrderInDb = async (
  selectedOrder: Order,
  amount: string,
  isBuy: boolean,
  isRange: boolean,
  newOrderPriceInfo: CreateOrderPriceInfoProps,
  token1Symbol: string,
  token2Symbol: string,
  isContinuous: boolean,
  walletAddress: string,
  selectedSetupId: number
): Promise<Order[]> => {
  const postData = {} as PostOrder;
  postData.budget = toNumber(amount);
  postData.order_type = isBuy ? "buy" : "sell";
  postData.price_type = isRange ? "range" : "single";
  if (isRange) {
    postData.from_price = toNumber(newOrderPriceInfo.minPrice);
    postData.to_price = toNumber(newOrderPriceInfo.maxPrice);
  } else {
    postData.single_price = toNumber(newOrderPriceInfo.targetPrice);
  }
  postData.is_continuous = isContinuous;
  postData.baseTokenLongName = newOrderPriceInfo.name1 as string;
  postData.baseTokenShortName = token2Symbol
    ? (token2Symbol as string)
    : (selectedOrder.baseTokenShortName as string);
  postData.pairTokenLongName = newOrderPriceInfo.name2 as string;
  postData.pairTokenShortName = token1Symbol
    ? (token1Symbol as string)
    : (selectedOrder.pairTokenShortName as string);
  postData.user_id = 1; ////TODO:get it from server
  postData.pair_address = newOrderPriceInfo.pair_address as string;
  postData.creator_address = walletAddress as string;
  postData.selectedSetupId = selectedSetupId;

  console.log("PostData:")
  console.log(postData)
  return await Orders.createOrder(postData);
};

const validatePriceRangeOrder = (order: Order): boolean => {
  if( order.from_price == null || order.to_price == null || order.budget == null)   return false;
  return true;
};

const validateTargetPriceOrder = (order: Order): boolean => {
  if( order.single_price == null || order.budget == null) return false;
  return true;
};

type EditOrderResult = {
  success: boolean;
  msg?: string;
};

const createPriceRangeOrderInContract = async (
  createContinuousPriceRangeOrder: any,
  createNonContinuousPriceRangeOrder: any,
  order: Order,
  tokenPairInfo: TokenPairInfo
): Promise<EditOrderResult> => {
  if (!validatePriceRangeOrder(order)) {
    return {
      success: false,
      msg: "Invalid order.",
    };
  }

  if (order.is_continuous === true) {
    const result = await createContinuousPriceRangeOrder(
      tokenPairInfo?.pairedToken?.address as string,
      tokenPairInfo?.baseToken?.address as string,
      order.order_type === "buy",
      order.from_price!,
      order.to_price!,
      order.budget!,
      Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
    );
    if (result?.msg === "success") {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        msg: result?.msg,
      };
    }
  } else {
    const result = await createNonContinuousPriceRangeOrder(
      tokenPairInfo?.pairedToken?.address as string,
      tokenPairInfo?.baseToken?.address as string,
      order.order_type === "buy",
      order.from_price!,
      order.to_price!,
      order.budget!
    );
    if (result?.msg === "success") {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        msg: result?.msg,
      };
    }
  }
};

const createTargetPriceOrderInContract = async (
  createContinuousTargetPriceOrder: any,
  createNonContinuousTargetPriceOrder: any,
  order: Order,
  tokenPairInfo: TokenPairInfo
): Promise<EditOrderResult> => {
  if (!validateTargetPriceOrder(order)) {
    return {
      success: false,
      msg: "Invalid order.",
    };
  }

  if (order.is_continuous === true) {
    const result = await createContinuousTargetPriceOrder(
      tokenPairInfo?.pairedToken?.address as string,
      tokenPairInfo?.baseToken?.address as string,
      order.order_type === "buy",
      order.single_price!,
      order.budget!,
      Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
    );

    if (result?.msg === "success") {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        msg: result?.msg,
      };
    }
  } else {
    const result = await createNonContinuousTargetPriceOrder(
      tokenPairInfo?.pairedToken?.address as string,
      tokenPairInfo?.baseToken?.address as string,
      order.order_type === "buy",
      order.single_price!,
      order.budget!
    );

    if (result?.msg === "success") {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        msg: result?.msg,
      };
    }
  }
};

export const createOrderInContract = async (
  createContinuousTargetPriceOrder: any,
  createNonContinuousTargetPriceOrder: any,
  createContinuousPriceRangeOrder: any,
  createNonContinuousPriceRangeOrder: any,
  toast: Function,
  order: Order,
  tokenPairInfo: TokenPairInfo
) => {
  if (order.price_type === "range") {
    const editResult = await createPriceRangeOrderInContract(
      createContinuousPriceRangeOrder,
      createNonContinuousPriceRangeOrder,
      order,
      tokenPairInfo
    );

    if (!editResult.success) {
      toast(editResult.msg, { type: "error" });
    } else {
      toast("Order successfully updated", { type: "success" });
      return true;
    }
  } else {
    const editResult = await createTargetPriceOrderInContract(
      createContinuousTargetPriceOrder,
      createNonContinuousTargetPriceOrder,
      order,
      tokenPairInfo
    );

    if (!editResult.success) {
      toast(editResult.msg, { type: "error" });
    } else {
      toast("Order successfully updated", { type: "success" });
      return true;
    }
  }
};
