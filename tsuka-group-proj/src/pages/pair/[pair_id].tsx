import _ from "lodash";
import { LiveGraphToken } from "@/components/tokens/live-graph.token";
import { OrderBookToken } from "@/components/order-book/order-book.token";
import { OrderWidgetToken } from "@/components/tokens/order-widget.token";
import { DefaultButton } from "@/components/ui/buttons/default.button";
import { LoadingBox } from "@/components/ui/loading/loading-box";
import { DeletedAlertToken } from "@/components/ui/my-order/deleted-alert.token";
import { EditOrderToken } from "@/components/ui/my-order/edit-order.token";
import { FullHeaderToken } from "@/components/ui/tokens/full-header.token";
import { getLiveDexTrades } from "@/lib/bitquery/dexTradesLiveStream";
import Orders from "@/lib/api/orders";
import Strategies from "@/lib/api/strategies";
import { stopBitqueryStream } from "@/lib/bitquery/getBitqueryStreamData";
import { getOrdersByPair } from "@/lib/orders";
import {
  HistoricalDexTrades,
  getHistoricalDexTrades,
} from "@/lib/token-activity-feed";
import { getTokenNamesFromPair } from "@/lib/token-pair";
import { getTokenPrice, getTokenPriceClientSide } from "@/lib/token-price";
import { TokenPriceInPair } from "@/types";
import type { Order, Strategy, TokenPairInfo } from "@/types";
import {
  OrderStatusEnum,
  OrderTypeEnum,
  PriceTypeEnum,
} from "@/types/token-order.type";
import { createClient } from "graphql-ws";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import { ModifiedOrder } from "@/lib/setups";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { Token } from "@/types/token.type";
import { fetchTestnet } from "@/helpers/fetch-testnet";

export default function Pair({
  initialOrders,
  historicalDexTrades,
  tokenPairInfo,
}: {
  initialOrders: Order[];
  historicalDexTrades: Array<HistoricalDexTrades>;
  tokenPairInfo: TokenPairInfo;
  setups: Array<Strategy>;
}) {
  let WebSocketImpl: typeof WebSocket;

  if (typeof WebSocket === "undefined") {
    WebSocketImpl = require("ws");
  } else {
    WebSocketImpl = WebSocket;
  }

  const client = createClient({
    url: "wss://streaming.bitquery.io/graphql",
    webSocketImpl: WebSocketImpl,
    connectionParams: () => ({
      headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_BITQUERY_API_KEY,
      },
    }),
  });

  const extractTrades = (data: any): any[] => {
    return data.data.EVM.DEXTrades.map((trade: any) => {
      const obj = trade.Trade;
      const side = Object.keys(trade.Trade)[0];
      return {
        side,
        tradeAmount: obj[side].Amount,
        price: obj[side].Price,
        transaction: {
          txFrom: {
            address: obj[side].Currency.SmartContract,
          },
        },
      };
    });
  };
  const [providerUrl, setProviderUrl] = useState(
    process.env.PROVIDER_TESTNET_URL as string
  );
  const [network, setNetwork] = useState("");
  const router = useRouter();
  const [setups, setSetups] = useState<Array<Strategy>>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(-1);
  const [showDeletedAlert, setShowDeletedAlert] = useState<boolean>(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState<boolean>(false);
  const [pairAddress, setPairAddress] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<boolean>(false);
  const [dexTrades, setDexTrades] =
    useState<HistoricalDexTrades[]>(historicalDexTrades);
  useEffect(() => {
    setStrategies(setups);
  }, [strategies]);

  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [tokenPrice, setTokenPrice] = useState<TokenPriceInPair>()
  const [oldTokenPrice, setOldTokenPrice] = useState<TokenPriceInPair>()

  const onOrderAdded = (newOrder: Order) => {
    setOrders([...orders, newOrder]);
  };
  useEffect(() => {
    if (setups.length > 0) setActiveStatus(true);
  }, [setups]);
  useEffect(() => {
    const fetchTokenPairInfo_ActiveOrders = async () => {
      try {
        if (!pairAddress || _.isEmpty(pairAddress)) return;
        const walletAddress: string = (await getConnectedAddress()) as string;
        const res_1 = await Orders.getActiveOrdersbyTokenPair({
          tokenpair: pairAddress,
          walletAddress,
        });
        setActiveOrders(res_1);
      } catch (err) {
        console.log("errors");
        console.error(err);
      }
    };

    fetchTokenPairInfo_ActiveOrders();
  }, [pairAddress,orders]);
  const handleChainChanged = async (chainId: any) => {
    setNetwork(chainId);
    const { provider } = await fetchTestnet({ chainId, providerUrl });

    // TODO new methods with provider
  };
  useEffect(() => {
    if (window.ethereum !== undefined) {
      window?.ethereum?.on?.("chainChanged", handleChainChanged);
    }
    const load = async () => {
      const address = await getConnectedAddress();
      if (address) {
        const tempSetups = await Strategies.getStrategiesData(address);
        setSetups(tempSetups);
        console.log("Here is dashboard setup", setups);
      }
    };
    load();
  }, []);
  useEffect(() => {
    router.isReady && setIsLoading(false);
  }, [router.isReady]);

  const [token, setToken] = useState<Token>();
  useEffect(() => {
    return () => {
      // Stop subscribing from the Bitquery
      stopBitqueryStream();
    };
  }, [pairAddress]);

  useEffect(() => {
    setPairAddress(String(router.query.pair_id));
  }, [router]);

  useEffect(() => {
    const time = 15;
    const pairAddress = router.query.pair_id;
    if (!pairAddress) {
      return;
    }
    if (!tokenPairInfo || _.isEmpty(tokenPairInfo)) {
      return;
    }
    const eachAddress = {
      base: tokenPairInfo.baseToken?.address,
      quote: tokenPairInfo.pairedToken?.address,
      pairAddress: pairAddress,
      time: time,
    };
  }, [tokenPairInfo]);

  const handleEditModal = (show: boolean, id: number) => {
    setSelectedOrderId(id);
    setShowEditOrderModal(show);
    setIsEdit(true);
  };

  useEffect(() => {
    const onNext = (data: any) => {
      //console.log("setSellTrades = ", data);

      const updatedTrades = extractTrades(data);

      setDexTrades((prev: Array<HistoricalDexTrades>) => [
        ...prev,
        ...updatedTrades,
      ]);
    };

    let unsubscribe = () => {};
    (async () => {
      await new Promise<void>((resolve, reject) => {
        unsubscribe = client.subscribe(
          getLiveDexTrades(tokenPairInfo.baseToken?.address ?? ""),
          {
            next: onNext,
            error: (err: any) => {
              console.log("Subscription error:", err);
              reject(err);
            },
            complete: () => {
              console.log("Subscription complete");
              resolve();
            },
          }
        );
      });
    })();

    return () => {
      unsubscribe();
    };
  }, [tokenPairInfo]);

  useEffect(() => {
    const getPriceData = async () => {
      const pairAddress = router.query.pair_id as string;
      const [tokenPriceData, oldTokenPriceData] = await Promise.all([
        getTokenPriceClientSide(pairAddress, false),
        getTokenPriceClientSide(pairAddress, false)
      ])

      setTokenPrice(tokenPriceData)
      setOldTokenPrice(oldTokenPriceData)
    }

    getPriceData()
  }, [])

  return (
    <div className="flex flex-col px-4 py-6 md:px-10">
      {tokenPairInfo && (
        <FullHeaderToken
          tokenPairInfo={tokenPairInfo}
          pair_address={String(pairAddress)}
          orders={orders}
          token_price={tokenPrice}
          oldTokenPrice={oldTokenPrice?.base_price ?? 0}
          setToken={setToken}
        />
      )}
      <div className=" grid grid-cols-11 gap-4 ">
        <div className="col-span-12 md:col-span-8">
          {/*<LiveGraphToken token={token.chain?.code} />*/}
          <LiveGraphToken tokenPairInfo={tokenPairInfo} />
          <div className="hidden md:grid grid-cols-8 gap-4">
            <div className="col-span-12">
              <OrderBookToken
                dexTrades={dexTrades}
                tokens={[
                  {
                    //value: "0x99ac8ca7087fa4a2a1fb6357269965a2014abc35",
                    value: orders[0]?.pair_address ?? ("" as string),
                    label:
                      orders[0]?.baseTokenShortName == "USDT" ||
                      orders[0]?.baseTokenShortName == "USDC" ||
                      orders[0]?.baseTokenShortName == "WETH" ||
                      orders[0]?.baseTokenShortName == "DAI"
                        ? `${orders[0]?.pairTokenShortName}/${orders[0]?.baseTokenShortName}`
                        : `${orders[0]?.baseTokenShortName}/${orders[0]?.pairTokenShortName}`,
                  },
                ]}
                orders={[
                  {
                    network: "Ethereum",
                    name1: orders[0]?.baseTokenLongName ?? "",
                    code1: orders[0]?.baseTokenShortName ?? "",
                    name2: orders[0]?.pairTokenLongName ?? "",
                    code2: orders[0]?.pairTokenShortName ?? "",
                    pair_address: pairAddress,
                    orders: orders.map(
                      (order) =>
                        ({
                          ...order,
                          id: order.order_id,
                          price: order.single_price ?? 0,
                          prices: [order.from_price ?? 0, order.to_price ?? 0],
                        } as ModifiedOrder)
                    ),
                  },
                ]}
                canChangeTokenPair={false}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-3">
          <DefaultButton
            label="Create an Order"
            callback={() => {
              setShowEditOrderModal(true);
              setIsEdit(false);
            }}
            filled={true}
            Icon={FiPlusCircle}
            walletRequired={true}
            enabled={activeStatus}
          />
          {activeOrders.length > 0 && (
            <OrderWidgetToken
              name1={tokenPairInfo?.baseToken?.name as string}
              code1={tokenPairInfo?.baseToken?.symbol as string}
              name2={tokenPairInfo?.pairedToken?.name as string}
              code2={tokenPairInfo?.pairedToken?.symbol as string}
              status={"Active" as OrderStatusEnum}
              orders={activeOrders.map((order) => ({
                id: order.order_id as number,
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
          )}
        </div>
      </div>
      <div className="block lg:hidden">
        <OrderWidgetToken
          name1={tokenPairInfo?.baseToken?.name as string}
          code1={tokenPairInfo?.baseToken?.symbol as string}
          name2={tokenPairInfo?.pairedToken?.name as string}
          code2={tokenPairInfo?.pairedToken?.symbol as string}
          status={"Active" as OrderStatusEnum}
          orders={activeOrders.map((order) => ({
            id: order.order_id as number,
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
      {showEditOrderModal && (
        <EditOrderToken
          name1={tokenPairInfo?.baseToken?.name as string}
          code1={tokenPairInfo?.baseToken?.symbol as string}
          name2={tokenPairInfo?.pairedToken?.name as string}
          code2={tokenPairInfo?.pairedToken?.symbol as string}
          setups={setups}
          pair_price_info={tokenPrice}
          pair_address={pairAddress}
          setShowEditOrderModal={setShowEditOrderModal}
          selectedOrderId={selectedOrderId}
          isEdit={isEdit}
          onOrderAdded={onOrderAdded}
          closeHandler={() => {
            setShowEditOrderModal(false);
            setSelectedOrderId(-1);
          }}
        />
      )}
      {showDeletedAlert && (
        <DeletedAlertToken setShowDeletedAlert={setShowDeletedAlert} />
      )}
      {isLoading && (
        <div className="z-40 w-screen h-screen">
          <LoadingBox
            title="Loading data"
            description="Please wait patiently as we process your transaction, ensuring it is secure and reliable."
          />
        </div>
      )}
    </div>
  );
}

async function getOrdersByPairSafe(pair_id: string): Promise<Order[]> {
  try {
    const data = await getOrdersByPair(pair_id as string, "", "Active");
    return data
  } catch (e) {
    console.log("Error getting orders by pair", e);
    return [];
  }
}

async function getTokenPriceSafe(pair_id: string): Promise<TokenPriceInPair> {
  try {
    const data = await getTokenPrice(pair_id as string);
    return data
  } catch (e) {
    console.log("Error getting token price", e);
    return {
      base_price: 0,
      quote_price: 0,
    };
  }
}

async function getOldTokenPriceSafe(
  pair_id: string
): Promise<TokenPriceInPair> {
  try {
    const result = await getTokenPrice(pair_id as string, true);
    return result;
  } catch (err) {
    console.log("[pair_id].tsx: Error getting old token price", err);
    return {
      base_price: 0,
      quote_price: 0,
    };
  }
}

async function getNameAndHistoricalDexTradesSafe(pair_id: string): Promise<{
  tokenPairInfo: TokenPairInfo;
  historicalDexTrades: Array<HistoricalDexTrades>;
}> {
  try {
    const tokenPairNamesResult = await getTokenNamesFromPair(pair_id as string);
    var tokenPairInfo: TokenPairInfo;
    var historicalDexTrades: Array<HistoricalDexTrades> = [];

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
        historicalDexTrades = historicalDexTradesResult.historicalDexTrades.map(
          (item) => ({
            ...item,
            tokenPairInfo,
          })
        );
      }

      return {
        tokenPairInfo,
        historicalDexTrades,
      };
    } else {
      return {
        tokenPairInfo: {
          baseToken: {
            name: "",
            symbol: "",
            address: "",
          },
        },
        historicalDexTrades: [],
      };
    }
  } catch (error) {
    console.log("Error getting token pair names", error);
    return {
      tokenPairInfo: {
        baseToken: {
          name: "",
          symbol: "",
          address: "",
        },
      },
      historicalDexTrades: [],
    };
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [
    orders,
    { tokenPairInfo, historicalDexTrades },
  ] = await Promise.all([
    getOrdersByPairSafe(context.query.pair_id as string),
    getNameAndHistoricalDexTradesSafe(context.query.pair_id as string),
  ]);

  return {
    props: {
      initialOrders: orders,
      tokenPairInfo,
      historicalDexTrades,
    }, 
  };
};
