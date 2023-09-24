import { OrderBookToken } from "@/components/order-book/order-book.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import { FullHeaderStrategies } from "@/components/ui/strategies/full-header.strategies";
import { ModifiedOrder, Setup, TokenPairOrders, getSetups } from "@/lib/setups";

import { useAppDispatch } from "@/store/hooks";
import { Order, Strategy } from "@/types";
import {
  OrderStatusEnum,
  OrderTypeEnum,
  PriceTypeEnum,
} from "@/types/token-order.type";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useState, useEffect } from "react";
import {
  HiOutlineArrowLongLeft,
  HiOutlineArrowLongRight,
} from "react-icons/hi2";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { getTokenNamesFromPair } from "@/lib/token-pair";
import type { TokenPairInfo } from "@/types";
import {
  HistoricalDexTrades,
  getHistoricalDexTrades,
} from "@/lib/token-activity-feed";
import moment from "moment";
import Strategies from "@/lib/api/strategies";

export const mapModifiedOrderToOrder = (modifiedOrder: ModifiedOrder) =>
  ({
    ...modifiedOrder,
    order_id: modifiedOrder.id,
  } as unknown as Order);

export default function StrategyDetails({
  id,
  orders,
  currentSetup,
  historicalDexTrades,
  setups,
}: {
  id: string;
  orders: Array<TokenPairOrders>;
  currentSetup: Setup;
  historicalDexTrades: Array<HistoricalDexTrades>;
  setups: Array<Strategy>;
}) {
  const [showIndex, setShowIndex] = useState(0);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);
  const [showDeletedAlert, setShowDeletedAlert] = useState<boolean>(false);
  const [dexTrades, setDexTrades] =
    useState<HistoricalDexTrades[]>(historicalDexTrades);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

  const [status, setStatus] = useState<"ok" | "loading" | "failed">("ok");

  const handlePrevIndex = useCallback(() => {
    setShowIndex((prev) => prev - 1);
  }, []);

  const handleNextIndex = useCallback(() => {
    setShowIndex((prev) => prev + 1);
  }, []);
  const handleEditModal = (show: boolean, id: number) => {
    console.log(show, id);
    setSelectedOrderId(id);
    setShowEditOrderModal(show);
  };
  useEffect(() => {
    const load = async () => {
      const address = await getConnectedAddress();
      if (
        currentSetup.creator_address &&
        currentSetup.creator_address !== address
      ) {
        window.location.href = "/strategies";
      } else {
        setLoadingStatus(true);
      }
    };
    load();
  }, []);

  return (
    <div className="flex flex-col">
      {currentSetup && loadingStatus && (
        <div className="p-8">
          <FullHeaderStrategies
            strategyDetails={currentSetup}
            status={status}
          />
          <div className="hidden grid-cols-9 gap-4 md:grid">
            {currentSetup?.orderTokens?.map((item, index) => (
              <div key={index} className="col-span-9 md:col-span-3">
                <OrderWidgetToken
                  name1={item.name1}
                  code1={item.name1}
                  name2={item.name2}
                  code2={item.code2}
                  status={
                    item.orders.filter(
                      (a) => a.status === "Canceled" || a.status === "Closed"
                    ).length > 0
                      ? OrderStatusEnum.CANCELLED
                      : OrderStatusEnum.ACTIVE
                  }
                  orders={item.orders.map((order) => ({
                    id: order.id as number,
                    budget: order.budget as number,
                    price_type: order.price_type as PriceTypeEnum,
                    order_type: order.order_type as OrderTypeEnum,
                    status: order.status as OrderStatusEnum,
                    is_continuous: order.is_continuous as boolean,
                    baseTokenShortName: order.baseTokenShortName as string,
                    baseTokenLongName: order.baseTokenLongName as string,
                    pairTokenShortName: order.pairTokenShortName as string,
                    pairTokenLongName: order.pairTokenLongName as string,
                    price: order.single_price as number,
                    prices: [order.from_price, order.to_price],
                  }))}
                  setShowEditOrderModal={handleEditModal}
                  setShowDeletedAlert={setShowDeletedAlert}
                />
              </div>
            ))}
          </div>
          <div className="relative md:hidden">
            <button
              type="button"
              disabled={showIndex <= 0}
              onClick={handlePrevIndex}
              className={`${
                showIndex <= 0 ? "hidden" : ""
              } absolute flex p-2 rounded-full bg-tsuka-400 shadow-xl text-tsuka-50 top-[50%] -left-6`}
            >
              <label>
                <HiOutlineArrowLongLeft size={24} />
              </label>
            </button>
            {currentSetup?.orderTokens?.map(
              (item, index) =>
                showIndex === index && (
                  <div key={index} className="col-span-9">
                    <OrderWidgetToken
                      name1={item.name1}
                      code1={item.code1}
                      name2={item.name2}
                      code2={item.code2}
                      status={
                        item.orders.filter(
                          (a) =>
                            a.status === "Canceled" || a.status === "Closed"
                        ).length > 0
                          ? OrderStatusEnum.CANCELLED
                          : OrderStatusEnum.ACTIVE
                      }
                      orders={item.orders.map((order) => ({
                        id: order.id as number,
                        budget: order.budget as number,
                        price_type: order.price_type as PriceTypeEnum,
                        order_type: order.order_type as OrderTypeEnum,
                        status: order.status as OrderStatusEnum,
                        is_continuous: order.is_continuous as boolean,
                        baseTokenShortName: order.baseTokenShortName as string,
                        baseTokenLongName: order.baseTokenLongName as string,
                        pairTokenShortName: order.pairTokenShortName as string,
                        pairTokenLongName: order.pairTokenLongName as string,
                        price: order.single_price as number,
                        prices: [order.from_price, order.to_price],
                      }))}
                      setShowEditOrderModal={handleEditModal}
                      setShowDeletedAlert={setShowDeletedAlert}
                    />
                  </div>
                )
            )}
            <button
              type="button"
              disabled={showIndex >= currentSetup?.orderTokens?.length - 1}
              onClick={handleNextIndex}
              className={`${
                showIndex >= currentSetup?.orderTokens?.length - 1
                  ? "hidden"
                  : ""
              } absolute flex p-2 rounded-full bg-tsuka-400 shadow-xl text-tsuka-50 top-[50%] -right-6`}
            >
              <label>
                <HiOutlineArrowLongRight size={24} />
              </label>
            </button>
          </div>
          {showEditOrderModal && (
            <EditOrderToken
              setShowEditOrderModal={setShowEditOrderModal}
              selectedOrderId={selectedOrderId}
              closeHandler={() => {
                setShowEditOrderModal(false);
                setSelectedOrderId(-1);
              }}
              setups={setups}
            />
          )}
          <OrderBookToken
            tokens={currentSetup.orderTokens.map((order) => ({
              value: order.pair_address,
              label:
                order.code1 == "USDT" ||
                order.code1 == "USDC" ||
                order.code1 == "WETH" ||
                order.code1 == "DAI"
                  ? `${order.code2}/${order.code1}`
                  : `${order.code1}/${order.code2}`,
            }))}
            orders={currentSetup.orderTokens}
            dexTrades={dexTrades}
            canChangeTokenPair= {true}
          />
        </div>
      )}
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  let tokenPairInfo: TokenPairInfo = {};
  let historicalDexTrades: Array<HistoricalDexTrades> = [];

  //Get all orders in strategy
  const allSetups = (await getSetups()).setups;
  const currentSetup = allSetups.filter((a) => a.id === id)[0];
  const orders = currentSetup.orderTokens;

  const getHistoricalDataForPair = async (pair_id: string) => {
    try {
      const tokenPairNamesResult = await getTokenNamesFromPair(pair_id);

      if (tokenPairNamesResult.success && tokenPairNamesResult.tokenPairInfo) {
        tokenPairInfo = tokenPairNamesResult.tokenPairInfo;

        let historicalDexTradesResult = await getHistoricalDexTrades(
          tokenPairInfo.baseToken?.address as string,
          tokenPairInfo.pairedToken?.address as string
        );

        if (
          historicalDexTradesResult.success &&
          historicalDexTradesResult.historicalDexTrades
        ) {
          return historicalDexTradesResult.historicalDexTrades.map((item) => ({
            ...item,
            tokenPairInfo,
          }));
        }
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  //Get list pair addresses
  const pairAddresses: Array<string> = [];
  for (const a of orders) {
    if (!pairAddresses.includes(a.pair_address)) {
      pairAddresses.push(a.pair_address);
    }
  }

  for (const address of pairAddresses) {
    const history = await getHistoricalDataForPair(address);
    if (history) {
      historicalDexTrades = [...historicalDexTrades, ...history];
    }
  }

  historicalDexTrades = historicalDexTrades.sort((a, b) =>
    moment(a.timestamp).isBefore(b.timestamp) ? 1 : -1
  );

  const address = await getConnectedAddress();
  const setups = await Strategies.getStrategiesData(address);

  //Get activity feed & order book info for each pair

  return {
    props: {
      id,
      orders,
      currentSetup,
      historicalDexTrades,
      setups,
    },
  };
};
