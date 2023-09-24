import { Order, TokenPriceInPair } from "@/types";
import Orders from "@/lib/api/orders";
import { Dispatch, SetStateAction } from "react";
import { getPairPriceInfo } from "./helpers";

//This runs when the edit order modal is opened
export const handleIsEditLoad = async (selectedOrderId: number, setSelectedOrder_L: Dispatch<SetStateAction<Order>>, setTokenPairPriceInfo: Dispatch<SetStateAction<TokenPriceInPair>>, setAmount: Dispatch<SetStateAction<string>>) => {
    try {
        //Get the intended order by its id
        const selectedOrder = await Orders.getOrderById(selectedOrderId ?? 0)
        setSelectedOrder_L(selectedOrder);

        //Get the token pairs pricing information
        await getPairPriceInfo(selectedOrder, setTokenPairPriceInfo)

        //Set the order amount to be the budget of the order
        setAmount(selectedOrder.budget?.toLocaleString("en-us") ?? "0")
    } catch (e) {
        console.log(e)
    }
}