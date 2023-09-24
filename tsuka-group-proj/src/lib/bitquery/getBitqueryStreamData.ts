import { createSubscriptionClient } from "./subscription-client";
import {
  getBitqueryStream,
  initBitqueryData,
  initBitqueryStreamData,
} from "@/store/apps/bitquery-data";
import { store } from "@/store";
import { TokenPairInfo } from "@/types";
import HomePageTokens from "../api/tokens";

const client = createSubscriptionClient();

// manipulate the historical data
export const transformData = async (data: any) => {
  return data.map((item: any) => ({
    time: new Date(item.timeInterval.minute + " UTC").getTime(),
    open: parseFloat(item.open),
    high: parseFloat(item.high),
    low: parseFloat(item.low),
    close: parseFloat(item.close),
  }));
};
// manipulate the subscription data
export const transformStreamData = (data: any, compareTokenName: any) => {
  const buySide = data.data.EVM?.buyside;
  const sellSide = data.data.EVM?.sellside;


  let buySideFiltered =
    buySide.length !== 0
      ? buySide.filter(
          (item: any) =>
            item.Trade.Sell.Currency.Symbol.toUpperCase() ===
            compareTokenName.toUpperCase()
        )
      : [];

  let { buySidePrices, buySideTimes } = buySideFiltered.reduce(
    (acc: any, item: any) => {
      acc.buySidePrices.push(item.Trade.Buy.Price);
      acc.buySideTimes.push(item.Block.Time);
      return acc;
    },
    { buySidePrices: [], buySideTimes: [] }
  );
  let sellSideFiltered =
    sellSide.length !== 0
      ? sellSide.filter(
          (item: any) =>
            item.Trade.Sell.Currency.Symbol.toUpperCase() ===
            compareTokenName.toUpperCase()
        )
      : [];
  let { sellSidePrices, sellSideTimes } = sellSideFiltered.reduce(
    (acc: any, item: any) => {
      acc.sellSidePrices.push(item.Trade.Sell.Price);
      acc.sellSideTimes.push(item.Block.Time);
      return acc;
    },
    { sellSidePrices: [], sellSideTimes: [] }
  );

  const buySideTime =
    buySideTimes.length !== 0 ? buySideTimes[buySideTimes.length - 1] : "";
  const buySideOpen = buySidePrices.length !== 0 ? buySidePrices[0] : "";
  const buySideHigh =
    buySidePrices.length !== 0 ? Math.max(...buySidePrices) : "";
  const buySideLow =
    buySidePrices.length !== 0 ? Math.min(...buySidePrices) : "";
  const buySideClose =
    buySidePrices.length !== 0 ? buySidePrices[buySidePrices.length - 1] : "";

  const sellSideTime =
    sellSideTimes.length !== 0 ? sellSideTimes[sellSideTimes.length - 1] : "";
  const sellSideOpen = sellSidePrices.length !== 0 ? sellSidePrices[0] : "";
  const sellSideHigh =
    sellSidePrices.length !== 0 ? Math.max(...sellSidePrices) : "";
  const sellSideLow =
    sellSidePrices.length !== 0 ? Math.min(...sellSidePrices) : "";
  const sellSideClose =
    sellSidePrices.length !== 0
      ? sellSidePrices[sellSidePrices.length - 1]
      : "";

  const time = buySideTime !== "" ? buySideTime : sellSideTime;
  const open = buySideOpen !== "" ? buySideOpen : sellSideOpen;
  const high = buySideHigh !== "" ? buySideHigh : sellSideHigh;
  const low = buySideLow !== "" ? buySideLow : sellSideLow;
  const close = buySideClose !== "" ? buySideClose : sellSideClose;

  return {
    time: new Date(time).getTime(),
    open,
    high,
    low,
    close,
  };
};
// Get OHLC data from the datas
export const getAddData = (forwardTime: any, data: any) => {
  const filterData = data.filter((item: any) => item.time < forwardTime);
  const time = forwardTime;
  const open = filterData[0];
  const close = filterData[filterData.length - 1];
  const high = Math.max(...filterData);
  const low = Math.min(...filterData);
  return {
    time,
    open,
    high,
    low,
    close,
  };
};

// WETH / USDC trades
const fetchStreamData = async (pairAddress: any, setDatas: any = undefined) => {
  console.log("PairAddress", pairAddress);
  if (typeof window !== "undefined") {
    const subscription = client
      .request({
        query: `
        subscription RealTimeBlocks {
          EVM(network: eth, trigger_on: head) {
            buyside: DEXTrades(
              orderBy: {descending: Block_Time}
              where: {Trade: {Buy: {Currency: {SmartContract: {is: "${pairAddress}"}}}}}
            ) {
              Block {
                Number
                Time
              }
              Transaction {
                From
                To
                Hash
              }
              Trade {
                Buy {
                  Amount
                  Buyer
                  Currency {
                    Name
                    Symbol
                    SmartContract
                  }
                  Seller
                  Price
                }
                Sell {
                  Amount
                  Buyer
                  Currency {
                    Name
                    SmartContract
                    Symbol
                  }
                  Seller
                  Price
                }
              }
            }
            sellside: DEXTrades(
              orderBy: {descending: Block_Time}
              where: {Trade: {Buy: {Currency: {SmartContract: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}}}}
            ) {
              Block {
                Number
                Time
              }
              Transaction {
                From
                To
                Hash
              }
              Trade {
                Buy {
                  Amount
                  Buyer
                  Currency {
                    Name
                    Symbol
                    SmartContract
                  }
                  Seller
                  Price
                }
                Sell {
                  Amount
                  Buyer
                  Currency {
                    Name
                    SmartContract
                    Symbol
                  }
                  Seller
                  Price
                }
              }
            }
          }
        }
      `,
      })
      .subscribe({
        next: async (response: any) => {
          // handle subscription data
          console.log("streac response:",response);
          // const data = await response.json();
          // const compareTokenName =
          //   store.getState().tokenPairInfo.value.baseToken?.symbol;
          const tempTokenName = await HomePageTokens.getTokenPairInfo(pairAddress);

          const compareTokenName = tempTokenName.baseToken?.symbol;
          // console.log("dfkj, ", compareTokenName);
          const transData = transformStreamData(response, compareTokenName);
          console.log("transform", transData);
          if (setDatas) {
            console.log("1, transData from subscribe",  transData)
            setDatas(transData);
          } //Not set but Add using next line;
          // state.streamValue = [...state.streamValue, temp];
          if (transData.open != "")
            store.dispatch(getBitqueryStream(transData));
          return transData;
        },
        error: (error: any) => {
          // handle subscription errors
          console.log(error);
        },
        complete: () => {
          // handle subscription completion
          console.log("complete");
        },
      });
  }
};

// Request the Bitquery to subscribe
export const getBitqueryStreamData = async (pairAddress: any) => {
  client.unsubscribeAll();
  const streamData = await fetchStreamData(pairAddress);
};

// Stop subscribing when leaving the page and init the Store
export const stopBitqueryStream = () => {
  client.unsubscribeAll();
  store.dispatch(initBitqueryData());
  store.dispatch(initBitqueryStreamData());
};

// Request the Bitquery to subscribe
export const getBitqueryStreamData1 = async (
  pairAddress: any,
  setDatas: any
) => {
  client.unsubscribeAll();
  const streamData = await fetchStreamData(pairAddress, setDatas);
};
