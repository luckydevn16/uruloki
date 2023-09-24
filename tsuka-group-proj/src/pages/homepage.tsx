import { ContentHeader } from "@/components/ui/content-header/content-header.token";
import { LoadingBox } from "@/components/ui/loading/loading-box";
import { MostBuyOrders } from "@/components/ui/most-buy-orders/most-buy-orders.token";
import { MostSellOrders } from "@/components/ui/most-sell-orders/most-sell-orders.token";
import { TopGainers } from "@/components/ui/top-gainers/top-gainers.token";
import { TopMoversTokens } from "@/components/ui/top-movers-tokens/top-movers-tokens.token";
import {
  MostBuyOrdersMapper,
  MostSellOrdersMapper,
  TopGainersMapper,
  TopMoversMapper,
} from "@/lib/mapper";
import _ from "lodash";
import { cache, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Strategy, Tokens } from "@/types";
import { getTokens } from "@/lib/homepage/tokens";
import DataCache from "@/lib/caching/data-cache";

let currentTranslateX: number = 0;

export async function getServerSideProps() {
  console.log("Loading homepage")
  try {
    const start = Date.now()
    const cached_tokens = await DataCache.getIfFresh("homepage-tokens");
    console.log("Cached tokens:")
    console.log(cached_tokens)
  
    if(cached_tokens.stale || !cached_tokens?.data?.cached_data || cached_tokens?.data?.cached_data?.topGainers?.length === 0) {
      console.log("Cache was stale")
      const tokens = await getTokens();
      await DataCache.addToCache(tokens, "homepage-tokens", 60 * 60 * 6); //Cache for 6 hours
      return {
        props: { tokens },
      };
    } else {
      console.log("Cache was fresh")
      return {
        props: { tokens: cached_tokens.data.cached_data },
      };
    }
  } catch(e) {
    console.log(e)
  }
}

export default function Home({
  tokens,
}: {
  tokens: Tokens;
  strategies: Strategy[];
}) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const [value, setValue] = useState(tokens);
  const [status, setStatus] = useState(!tokens);

  let content: any = useRef();
  let x1: number = 0;
  let x2: number = 0;

  const delay = (delayInms: number) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
  };
  const moveTo = async (idx: number) => {
    let to: number = -window.innerWidth * idx;
    let delta = currentTranslateX >= to ? -10 : 10;
    while (Math.abs(currentTranslateX - to) > 11) {
      await delay(1);
      currentTranslateX += delta;
      content.current.style.transform = `translateX(${currentTranslateX}px)`;
    }
    currentTranslateX = to;
    content.current.style.transform = `translateX(${to}px)`;
    setCurrentIdx(idx);
  };

  const handleTouchStart = (event: any) => {
    x1 = event.touches[0].pageX;
  };
  const handleTouchMove = async (event: any) => {
    x2 = event.touches[0].pageX;
    let str: string = content.current.style.transform;
    if (str) {
      currentTranslateX = Number(str.slice(11, -3));
    } else currentTranslateX = 0;
    currentTranslateX += Math.floor(x2 - x1);
    content.current.style.transform = `translateX(${currentTranslateX}px)`;
    x1 = x2;
  };
  const handleTouchEnd = (event: any) => {
    let toIdx: number = 0;
    if (currentTranslateX >= window.innerWidth * -0.5) toIdx = 0;
    if (
      currentTranslateX >= window.innerWidth * -1.5 &&
      currentTranslateX < window.innerWidth * -0.5
    )
      toIdx = 1;
    if (currentTranslateX < window.innerWidth * -1.5) toIdx = 2;
    moveTo(toIdx);
  };

  useEffect(() => {
    if (value.mostBuyOrders?.length === 0) {
      const notify = () => toast.error("Failed to load MostBuyOrders data");
      notify();
    }
    if (value.mostSellOrders?.length === 0) {
      const notify = () => toast.error("Failed to load MostSellOrders data");
      notify();
    }
    if (value.topGainers?.length === 0) {
      const notify = () => toast.error("Failed to load TopGainers data");
      notify();
    }
    if (value.topMovers?.length === 0) {
      const notify = () => toast.error("Failed to load TopMovers data");
      notify();
    }
  }, [status]); 
  return (
    <>
      {(status === true || _.isEmpty(value)) && (
        <LoadingBox
          title="Loading data"
          description="Please wait patiently as we process your transaction, ensuring it is secure and reliable."
        />
      )}
      {status === false && !_.isEmpty(value) && (
        <div className="px-4 md:px-10 pt-6 pb-8">
          <ContentHeader title="Homepage" className="w-full mb-6" />
          <div className="hidden md:flex md:gap-5">
            <TopGainers topGainers={TopGainersMapper(value.topGainers)} />
            <MostBuyOrders
              mostBuyOrders={MostBuyOrdersMapper(value.mostBuyOrders)}
            />
            <MostSellOrders
              mostSellOrders={MostSellOrdersMapper(value.mostSellOrders)}
            />
          </div>
          <div className="swipable-container w-screen -ml-4 overflow-hidden">
            <div ref={content} className="md:hidden w-[300%] -ml-[0px] flex">
              <div className="w-1/3 px-4">
                <TopGainers topGainers={TopGainersMapper(value.topGainers)} />
              </div>
              <div className="w-1/3 px-4">
                <MostBuyOrders
                  mostBuyOrders={MostBuyOrdersMapper(value.mostBuyOrders)}
                />
              </div>
              <div className="w-1/3 px-4">
                <MostSellOrders
                  mostSellOrders={MostSellOrdersMapper(value.mostSellOrders)}
                />
              </div>
            </div>
          </div>
          <div className="md:hidden mt-3 w-full h-[3px] flex gap-2">
            <div
              className={`h-full w-1/3 ${
                currentIdx == 0 ? "bg-custom-primary" : "bg-tsuka-500"
              } cursor-pointer`}
              onClick={() => {
                moveTo(0);
              }}
            ></div>
            <div
              className={`h-full w-1/3 ${
                currentIdx == 1 ? "bg-custom-primary" : "bg-tsuka-500"
              } cursor-pointer`}
              onClick={() => {
                moveTo(1);
              }}
            ></div>
            <div
              className={`h-full w-1/3 ${
                currentIdx == 2 ? "bg-custom-primary" : "bg-tsuka-500"
              } cursor-pointer`}
              onClick={() => {
                moveTo(2);
              }}
            ></div>
          </div>
          <div className="mt-4">
            <TopMoversTokens topMovers={TopMoversMapper(value.topMovers)} />
          </div>
        </div>
      )}
    </>
  );
}
