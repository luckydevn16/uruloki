import { DropdownsetUpOption, Order } from "@/types";
import { Token } from "@/types/token.type";
import { useState, useEffect } from "react";
import { FiltersButton } from "../ui/buttons/filters.button";
import { OrderBookTokenUi } from "./order-book-token.ui";
import { OrderHistoryBookTokenUi } from "../ui/tokens/order-history-book-token.ui";
import { HistoricalDexTrades } from "@/lib/token-activity-feed";
import { TokenPairOrders } from "@/lib/setups";
import Select from "react-select";

export interface OrderBookTokens {
  value: string;
  label: string;
}

export const OrderBookToken: React.FC<{
  orders: TokenPairOrders[];
  tokens?: OrderBookTokens[];
  dexTrades: Array<HistoricalDexTrades>;
  canChangeTokenPair: boolean;
}> = ({ orders, tokens, dexTrades, canChangeTokenPair }) => {
  const [selectedPath, setSelectedPath] = useState("order-book");
  const [selectedOrder, setSelectedOrder] = useState<TokenPairOrders>();
  const handleSelected = async (e: any) => {
    const selectedOrder = orders.find(
      (order: any) => order.name1 === e.code1 && order.code2 === e.code2
    );
    setSelectedOrder(selectedOrder);
  };
  const [setupOptions, setSetupOptions] = useState<DropdownsetUpOption[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedOptions = orders.map((ele, idx) => ({
          label: ele.name1 + "/" + ele.code2,
          code1: ele.name1,
          code2: ele.code2,
          value: idx,
        }));
        await setSetupOptions(updatedOptions);
        console.log("this is set", setupOptions);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchData();
  }, [orders]);
  useEffect(() => {
    if (setupOptions.length > 0) handleSelected(setupOptions[0]);
  }, [setupOptions]);
  const options = [
    {
      title: "Order Book",
      path: "order-book",
    },
    {
      title: "Activity",
      path: "order-book-history",
    },
  ];

  const orderComponent =
    selectedPath === "order-book" ? (
      <OrderBookTokenUi
        orders={orders}
        selectedOrder={selectedOrder as TokenPairOrders}
        tokens={tokens as OrderBookTokens[]}
      />
    ) : (
      <OrderHistoryBookTokenUi dexTrades={dexTrades} />
    );

  return (
    <div className="px-2 mt-4 bg-tsuka-500 rounded-xl text-tsuka-100">
      <div className="flex items-center justify-start w-full px-2 pt-2 mb-2 border-b border-tsuka-400">
        {options.map(({ title, path }, index) => (
          <span
            key={index}
            onClick={() =>
              setSelectedPath((prev) =>
                prev === "order-book" ? "order-book-history" : "order-book"
              )
            }
            className={`${
              path === selectedPath
                ? "border-b-2 border-accent"
                : "border-b-2 border-transparent"
            } py-4 xs:p-4 text-center whitespace-nowrap mx-2 text-base sm:text-lg font-semibold text-tsuka-50 cursor-pointer`}
          >
            {title}
          </span>
        ))}
        {canChangeTokenPair && (
          <div className="w-[15%] ml-auto flex gap-2 text-sm">
            {setupOptions.length > 0 && (
              <Select
                defaultValue={setupOptions[0]}
                onChange={handleSelected}
                name="setup"
                options={setupOptions}
                className="basic-multi-select"
                placeholder="Setup"
                classNamePrefix="Setup"
              />
            )}
          </div>
        )}
      </div>
      {orderComponent && (
        <div className="overflow-x-scroll">{orderComponent}</div>
      )}
    </div>
  );
};
