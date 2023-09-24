import { Order, PatchOrder, OrderStrategy, TokenPairInfo } from "@/types";
import { toNumber } from "../number-helpers";
import Orders from "../api/orders";
import { useUrulokiAPI } from "@/blockchain";

export type CreateOrderPriceInfo = {
    minPrice: string;
    maxPrice: string;
    targetPrice: string;
}

export const editOrderInDb = async (selectedOrder: Order, amount: string, isBuy: boolean, isRange: boolean, 
    newOrderPriceInfo: CreateOrderPriceInfo, token1Symbol: string, token2Symbol: string, isContinuous: boolean, walletAddress: string, selectedSetupId: number,
    ): Promise<Order> => {

    const patchData = {} as PatchOrder;
      patchData.budget = toNumber(amount);
      patchData.order_type = isBuy ? "buy" : "sell";
      patchData.price_type = isRange ? "range" : "single";
      if (!isRange) {
        patchData.from_price = toNumber(newOrderPriceInfo.minPrice);
        patchData.to_price = toNumber(newOrderPriceInfo.maxPrice);
      } else {
        patchData.single_price = toNumber(newOrderPriceInfo.targetPrice);
      }
      patchData.pairTokenShortName = token1Symbol
        ? (token1Symbol as string)
        : (selectedOrder.pairTokenShortName as string);
      patchData.baseTokenShortName = token2Symbol
        ? (token2Symbol as string)
        : (selectedOrder.baseTokenShortName as string);
      patchData.is_continuous = isContinuous;
      patchData.creator_address = walletAddress as string;
    //   patchData.order_strategy = selectedSetup as OrderStrategy;
      patchData.selectedSetupId = selectedSetupId as number;
      return await Orders.editOrder(selectedOrder.order_id ?? 0, patchData)
}

const validatePriceRangeOrder = (order: Order): boolean => {
    console.log("here is Validation")
    return !order.from_price || !order.to_price || !order.budget
}

const validateTargetPriceOrder = (order: Order): boolean => {
    console.log("here is Validation")
    return !order.single_price || !order.budget
}

type EditOrderResult = {
    success: boolean;
    msg?: string;
}

const editPriceRangeOrderInContract = async (editContinuousPriceRangeOrder: any, editNonContinuousPriceRangeOrder: any, order: Order, tokenPairInfo: TokenPairInfo): Promise<EditOrderResult> => {
    if(!validatePriceRangeOrder(order)) {
        return {
            success: false,
            msg: "Invalid order."
        }
    }

    if (order.is_continuous === true) {
        const result = await editContinuousPriceRangeOrder(
            order.order_id,
            tokenPairInfo?.pairedToken?.address as string,
            tokenPairInfo?.baseToken?.address as string,
            order.order_type === "buy",
            order.from_price!,
            order.to_price!,
            order.budget!,
            Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
        )
        if (result?.msg === "success") {
            return {
                success: true,
            }
        } else {
            return {
                success: false,
                msg: result?.msg
            }
        }
    } else {
        const result = await editNonContinuousPriceRangeOrder(
            order.order_id,
            tokenPairInfo?.pairedToken?.address as string,
            tokenPairInfo?.baseToken?.address as string,
            order.order_type === "buy",
            order.from_price!,
            order.to_price!,
            order.budget!,
        )
        if (result?.msg === "success") {
            return {
                success: true,
            }
        } else {
            return {
                success: false,
                msg: result?.msg
            }
        }
    }
}

const editTargetPriceOrderInContract = async (editContinuousTargetPriceOrder: any, editNonContinuousTargetPriceOrder: any, order: Order, tokenPairInfo: TokenPairInfo): Promise<EditOrderResult> => {
    if(!validateTargetPriceOrder(order)) {
        return {
            success: false,
            msg: "Invalid order."
        }
    }

    if (order.is_continuous === true) {
        const result = await editContinuousTargetPriceOrder(
            order.order_id,
            tokenPairInfo?.pairedToken?.address as string,
            tokenPairInfo?.baseToken?.address as string,
            order.order_type === "buy",
            order.single_price!,
            order.budget!,
            Number(process.env.NEXT_PUBLIC_RESET_PERCENTAGE)
        )

        if (result?.msg === "success") {
            return {
                success: true,
            }
        } else {
            return {
                success: false,
                msg: result?.msg
            }
        }
      } else {
        const result = await editNonContinuousTargetPriceOrder(
            order.order_id as number,
            tokenPairInfo?.pairedToken?.address as string,
            tokenPairInfo?.baseToken?.address as string,
            order.order_type === "buy",
            order.single_price!,
            order.budget!,
        )

        if (result?.msg === "success") {
            return {
                success: true,
            }
        } else {
            return {
                success: false,
                msg: result?.msg
            }
        }
    }
}

export const editOrderInContract = async(editContinuousTargetPriceOrder: any, editNonContinuousTargetPriceOrder: any, editContinuousPriceRangeOrder: any, editNonContinuousPriceRangeOrder: any, toast: Function, order: Order, tokenPairInfo: TokenPairInfo) => {
    if (order.price_type === "range") {
        const editResult = await editPriceRangeOrderInContract(editContinuousPriceRangeOrder, editNonContinuousPriceRangeOrder, order, tokenPairInfo)

        if(!editResult.success) {
        toast(editResult.msg, { type: "error" })
        } else {
        toast("Order successfully updated", { type: "success" })
        }
    } else {
        const editResult = await editTargetPriceOrderInContract(editContinuousTargetPriceOrder, editNonContinuousTargetPriceOrder, order, tokenPairInfo)

        if(!editResult.success) {
        toast(editResult.msg, { type: "error" })
        } else {
        toast("Order successfully updated", { type: "success" })
        }
    }
}
