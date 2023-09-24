import _ from "lodash";
import {
  CandlestickData,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { BitqueryData, Order, TokenPairInfo } from "@/types";
import { useRouter } from "next/router";
import {
  stopBitqueryStream,
} from "@/lib/bitquery/getBitqueryStreamData";
import Orders from "@/lib/api/orders";
import { useEffect, useRef, useState } from "react";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { addMarkers, createLightweightChart, fetchData, getUpdatedData, updateChartSize } from "@/lib/chart";
import CandleWidthSelector from "./controls/candlewidthselector";
import OrderOverlayToggle from "./controls/orderoverlaytoggle";
// price label bg color #f03349
// time label bg color #363a45
// down color #d83045
// up color #179981
// average line color #199a82

interface Props {
  onLoaded: () => void;
  tokenPairInfo: TokenPairInfo;
  setDataUnavailable: React.Dispatch<React.SetStateAction<boolean>>;
}

// This is our lightweight chart
const BitqueryOHLCChart: React.FC<Props> = ({ onLoaded, tokenPairInfo, setDataUnavailable }) => {
  const router = useRouter();
  const [pairAddress, setPairAddress] = useState(router.query.pair_id as string);
  const [activeOrdersByTokenpair, setActiveOrdersByTokenpair] = useState<
    Order[]
  >([]);

  useEffect(() => {
    const fetchTokenPairInfo_ActiveOrders = async () => {
      try {
        const walletAddress: string = (await getConnectedAddress()) as string;
        const res_1 = await Orders.getActiveOrdersbyTokenPair({
          tokenpair: pairAddress,
          walletAddress,
        });
        setActiveOrdersByTokenpair(res_1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTokenPairInfo_ActiveOrders();
  }, [pairAddress]);

  const [chart, setChart] = useState<IChartApi | null>(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);
  let candleStickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [firstBitquery, setFirstBitquery] = useState<BitqueryData[]>([]);
  const [streamValue, setStreamValue] = useState<BitqueryData[]>([]);
  const [candleStickTime, setCandleStickTime] = useState<number>(15);
  const [forwardTime, setForwardTime] = useState<any>();
  const [wethPrice, setWethPrice] = useState<any>(1);
  const [firstWethPrice, setFirstWethPrice] = useState<any>(1);


  const [active, setActive] = useState(15);
  const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  // create the WeakSet (probably store in your state somewhere)
  const chartRemoved = new WeakSet();
  const [chartState, setChartState] = useState<undefined | {
    chart: IChartApi;
    candleSeries: ISeriesApi<"Candlestick">;
  }>(undefined);

  const setDatas = (transData: {
    time: number;
    open: any;
    high: string | number;
    low: string | number;
    close: any;
  }) => {
    // let a = [...streamValue];
    // a.push(transData);
    // setStreamValue(a);
    // if(transData.close === '' || transData.open === '' ){
    //   return;
    // }
    if(Number.isNaN(transData.time)){
      
    } else {
      setStreamValue(prevStreamValue => [...prevStreamValue, transData]);
      setForwardTime((prevForTime:number)=>{
        if(transData.time > prevForTime) {
          return prevForTime + candleStickTime * 60 * 1000;
        } else {
          return prevForTime;
        }
      })
      // if (transData.time > forwardTime) {
      //   alert("forwarding time"  + transData.time + ", +  original forwardTime = " + forwardTime);
      //   setForwardTime(forwardTime + candleStickTime * 60 * 1000);
      // }

    }
  };
  const fetchWethPrice = async () => {
    // Insert the URL of your chosen API endpoint for fetching the WETH/USD price
    const WETH_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
    
    const response = await fetch(WETH_API_URL);
    const data = await response.json();
    return data.ethereum.usd;
  };
  useEffect(() => {
    fetchData(pairAddress, tokenPairInfo, setCandleStickTime, setFirstBitquery, setForwardTime, setDatas);
   
    const fetchWeth = async () => {
      try {
        // const walletAddress: string = (await fetchWethPrice()) as string;
        const wethPriceUnit = await fetchWethPrice();

        const base=tokenPairInfo.baseToken?.address;
        const pair=tokenPairInfo.pairedToken?.address;
        let isWETHPair = false;
        if(base && pair){
          isWETHPair = base.toLowerCase() === WETH_ADDRESS || pair.toLowerCase() === WETH_ADDRESS;
        }
        // setWethPrice(wethPriceUnit);
        if(!isWETHPair)
          setWethPrice(wethPriceUnit);
        else
          setFirstWethPrice(wethPriceUnit);
          setWethPrice(1/2);


      } catch (err) {
        console.error(err);
      }
    };
    fetchWeth();
  }, [tokenPairInfo]);
  
  // When this page becomes unmounted
  useEffect(() => {
    return () => {
      // Stop subscribing from the Bitquery
      stopBitqueryStream();
    };
  }, []);

  useEffect(() => {
    onLoaded()
    if(firstBitquery.length == 0) setDataUnavailable(true)
    else setDataUnavailable(false)
  }, [firstBitquery])

  interface MyCandlestickData extends CandlestickData {
    [key: string]: any;
  }

  const candleStickClicked = async (stick: number) => {
    console.log("wethPrice", wethPrice)

    setCandleStickTime(stick);
    setActive(stick);
    if (!tokenPairInfo) return;
    fetchData(pairAddress, tokenPairInfo, setCandleStickTime, setFirstBitquery, setForwardTime, setDatas, stick);
  };
  function transformNumber(num:number) {
    let str = num.toExponential();
    let eIndex = str.indexOf('e');
    if (eIndex !== -1) {
        let exponent = parseInt(str.slice(eIndex + 1));
        return Number('1e' + (exponent - 1));
    }

    // If there's no 'e', just return the original number
    return num;
}
  useEffect(() => {
    if (!chartRef.current || !firstBitquery) return;
    const chart = createLightweightChart(chartRef.current);

    // the historical data from the Bitquery
    let temp: MyCandlestickData[] = [];
    // the time of last historical data in Store
    let tempTime: any = [];
    // manipuate the historical data for the chart
    firstBitquery.map((value: Record<string, any>, key: number) => {
      let tempItem: MyCandlestickData = {
        time: "",
        open: 0,
        high: 0,
        low: 0,
        close: 0,
      };
      if (tempTime === value["time"]) {
        return;
      }
      Object.keys(value).forEach((key: string) => {
        tempItem[key] = value[key];
      });
      tempTime = tempItem["time"];
      temp.push(tempItem);
    });
   
    // In case existing wrong sort by time
    temp.sort((a: Record<string, any>, b: Record<string, any>) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      // Compare the dates
      return dateA.getTime() - dateB.getTime();
    });
    let scale = 0.01;
    if(temp[0]){
      scale = transformNumber(temp[0].open)
    }

    // Add the candlestick to the chart
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      priceFormat: {
        type: 'custom',
        formatter: (price:any) => {
          
        },
        minMove: scale,
      }
    });
   
    console.log("firstWethPrice", firstWethPrice)
    let scaledData = temp.map((item) => ({
      ...item,
      open: item.open*firstWethPrice,
      high: item.high*firstWethPrice,
      low: item.low*firstWethPrice,
      close: item.close*firstWethPrice,
    }));
   

    // Set data to the chart
    candlestickSeries.setData(scaledData);
    if (showMarkers) {
      addMarkers(activeOrdersByTokenpair, candlestickSeries)
    }
    chart.timeScale().fitContent();

    // Insert the resizing code here
    // updateChartSize(chartRef.current, chart);

    setChart(chart);
    if(candlestickSeries)
    // update chart state 
    setChartState({ chart, candleSeries: candlestickSeries });
    candleStickSeriesRef.current = candlestickSeries;
    // When this page becomes unmounted
    return () => {
      window.removeEventListener("resize", () => {
        if(chartRef.current === null) return;
        console.log("removeEventListener");

        updateChartSize(chartRef.current, chart)
      });
      chart.remove();
      chartRemoved.add(chart);
      setChartState(undefined);
    };
  }, [firstBitquery, activeOrdersByTokenpair, showMarkers, candleStickTime]);
  if (typeof window !== "undefined") {
    // browser code
    window.onresize = function() {
      if(chartRef.current === null) return;
      if(chart === null) return;

      console.log("addEventListener");

      updateChartSize(chartRef.current, chart)
      
    };
  }

  
  // When subscription data arrives
  useEffect(() => {
    if (
      streamValue.length == 0 ||
      typeof streamValue.length == "undefined" ||
      !candleStickSeriesRef.current
    )
      return;
    if (typeof streamValue.length == "undefined") return;
    let updatedData: MyCandlestickData | null = null;
    // Get the OHLC data from subscription data in the Store
    updatedData = getUpdatedData(forwardTime, streamValue, candleStickTime);

    let updateData ={
      time:updatedData.time,
      open: updatedData.open*wethPrice,
      high: updatedData.high*wethPrice,
      low: updatedData.low*wethPrice,
      close: updatedData.close*wethPrice,
    };

    chartState?.candleSeries.update(updateData);
  }, [streamValue, forwardTime]);
  return (
    <>
      <div ref={chartRef} />
      <div className="flex flex-row gap-10">
        <OrderOverlayToggle
          showMarkers={showMarkers}
          setShowMarkers={setShowMarkers}
        />

        <CandleWidthSelector
          active={active}
          candleStickClicked={candleStickClicked}
        />
      </div>
    </>
  );
};

export default BitqueryOHLCChart;
