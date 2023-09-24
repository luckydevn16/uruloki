import { OrderBookTokens } from "@/components/order-book/order-book.token";
import { numberWithCommas } from "@/helpers/comma.helper";
import { ModifiedOrder, TokenPairOrders } from "@/lib/setups";
import { useAppSelector } from "@/store/hooks";
import { OrderBookData } from "@/types/orderbook.type";
import Orders from "@/lib/api/orders";
import { TokenOrderBooks } from "@/types/token-order-books.type";
import { Token } from "@/types/token.type";
import { useEffect, useState } from "react";
import { OrderBookHalf } from "./order-book-half";

interface OrderBookTokenUiProp {
  selectedOrder: TokenPairOrders; 
  tokens: OrderBookTokens[];
  orders: TokenPairOrders[];
}

export const OrderBookTokenUi: React.FC<OrderBookTokenUiProp> = ({
  orders,
  selectedOrder,
  tokens,
}) => {
  const [sellSum, setSellSum] = useState(0);
  const [buySum, setBuySum] = useState(0);
  const [orderBookData, setOrderBookData] = useState<OrderBookData>(
    new OrderBookData()
  );
  const [selectedToken, setSelectedToken] = useState<OrderBookTokens>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchSelectedToken = async () => {
      const foundToken = tokens.find((token: OrderBookTokens) => {
        return token.value === selectedOrder?.pair_address;
      });
      await setSelectedToken(foundToken);
      console.log("this is result", selectedOrder, "token", selectedToken);
    };
    fetchSelectedToken();
  }, [selectedOrder]);
  useEffect(() => {
    if (selectedToken) {
      let tempOrderBookData = orderBookData.fromOrders(
        orders.find(({ pair_address }) => pair_address === selectedToken.value)?.orders ?? []
      );
      setOrderBookData(tempOrderBookData);

      setSellSum(tempOrderBookData.getSellSum());
      setBuySum(tempOrderBookData.getBuySum());
    }
  }, [selectedToken]);

  const handleSelect = (token: OrderBookTokens) => {
    setSelectedToken(token);
  };

  return (
    <div>
      {loading && "Loading..."}
      {!loading && orderBookData && selectedOrder? (
        <div className="p-4 flex gap-2">
          <OrderBookHalf data={orderBookData.sell} isBuy={false} baseTokenShortName={selectedOrder.orders[0]?.baseTokenShortName ?? ""} pairTokenShortName={selectedOrder.orders[0]?.pairTokenShortName ?? ""} buyOrSellSum={sellSum}></OrderBookHalf>
          <OrderBookHalf data={orderBookData.buy} isBuy={true} baseTokenShortName={selectedOrder.orders[0]?.baseTokenShortName ?? ""} pairTokenShortName={selectedOrder.orders[0]?.pairTokenShortName ?? ""} buyOrSellSum={buySum}></OrderBookHalf>
        </div>
      ) : (
        "No orders provided"
      )}
    </div>
  );
};
