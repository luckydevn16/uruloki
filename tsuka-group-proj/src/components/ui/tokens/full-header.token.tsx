import { splitAddress } from "@/helpers/splitAddress.helper";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { Order, TokenPairInfo, TokenPriceInPair } from "@/types";

import { convertLawPrice, handleNumberFormat } from "@/lib/number-helpers";
import HomePageTokens from "@/lib/api/tokens";
import { Token } from "@/types/token.type";
import { InfoSpanToken } from "./info-span.token";

export interface FullHeaderTokenProps {
  pair_address: string;
  tokenPairInfo: TokenPairInfo;
  orders: Order[];
  token_price: TokenPriceInPair | undefined;
  oldTokenPrice: number;
  setToken: (t: Token) => void;
}

export const defaultNumberFormat = (num: number): any => {
  const newNum = Math.abs(num);
  let res;
  if (newNum >= 0.01) {
    res = handleNumberFormat(parseFloat(newNum.toFixed(2)));
  } else {
    res = Number(convertLawPrice(newNum));
    if (isNaN(res)) {
      res = "0";
    } else {
      res = res.toString().slice(1);
    }
  }
  return num >= 0 ? res : `-${res}`;
};

export const FullHeaderToken: React.FC<FullHeaderTokenProps> = ({
  pair_address,
  tokenPairInfo,
  orders,
  token_price,
  oldTokenPrice,
  setToken,
}) => {
  // const baseTokenAddress = useAppSelector(
  //   (state) => state.tokenPairInfo.value.baseToken.address
  // );
  const baseTokenAddress = tokenPairInfo.baseToken?.address;
  const [tokenVolume, setTokenVolume] = useState({
    value: 0,
    currencyLabel: "",
  });
  const [buyOrders, setBuyOrders] = useState<number>(0);
  const [sellOrders, setSellOrders] = useState<number>(0);

  // useEffect(() => {
  //   if (pair_address) {
  //     dispatch(setPairAddress(pair_address as string));
  //   }
  // }, [pair_address]);

  useEffect(() => {
    if (baseTokenAddress) {
      (async () => {
        const volume = await HomePageTokens.getTokenVolume(baseTokenAddress);
        let newTokenVolume: { value: number; currencyLabel: string } = {
          value: 0,
          currencyLabel: "",
        };
        const MILLION = 1e6,
          BILLION = 1e9,
          TRILLION = 1e12;
        if (volume.tradeAmount > TRILLION) {
          newTokenVolume.value = volume.tradeAmount / TRILLION;
          newTokenVolume.currencyLabel = "Trillion";
        } else if (volume.tradeAmount > BILLION) {
          newTokenVolume.value = Number(
            (volume.tradeAmount / BILLION).toString().slice(0, 4)
          );
          newTokenVolume.currencyLabel = "Billion";
        } else if (volume.tradeAmount > MILLION) {
          newTokenVolume.value = Number(
            (volume.tradeAmount / MILLION).toString().slice(0, 4)
          );
          newTokenVolume.currencyLabel = "Million";
        } else {
          newTokenVolume.value = volume.tradeAmount;
          newTokenVolume.currencyLabel = "";
        }
        console.log("New Volume:")
        console.log(newTokenVolume)
        setTokenVolume(newTokenVolume);
      })();
    }
  }, [baseTokenAddress]);

  useEffect(() => {
    let total_sell: number = 0;
    let total_buy: number = 0;
    if (orders.length) {
      total_sell = orders.filter((ele, id) => ele.order_type === "sell").length;
      total_buy = orders.filter((ele, id) => ele.order_type === "buy").length;
    }
    setBuyOrders(total_buy);
    setSellOrders(total_sell);
  }, [orders]);

  return (
    <div className="w-full text-tsuka-300 flex py-2 mb-4 sm:flex-col items-center sm:items-start lg:items-center lg:flex-row justify-between sm:justify-normal lg:justify-between">
      <>
        <div className="flex sm:mb-8 lg:mb-0 items-center">
          <Link
            href="/"
            className="text-xl pr-2 xs:p-2 rounded-full cursor-pointer"
          >
            <MdArrowBack />
          </Link>
          <div className="px-2 flex-1 flex-col">
            <p className="text-sm xs:text-base">
              <label className="text-tsuka-50 text-xl xs:text-2xl font-semibold">
                {tokenPairInfo.baseToken?.symbol}
              </label>
              /{tokenPairInfo.pairedToken?.symbol}
            </p>
            <div className="flex items-start flex-col md:flex-row">
              <label className="text-xs whitespace-nowrap">
                Pair Address: {splitAddress(pair_address)}
              </label>
              <label className="text-xs whitespace-nowrap md:ml-4"></label>
            </div>
          </div>
        </div>
        <div className=" lg:flex-1 flex w-full lg:w-auto justify-end sm:justify-between lg:justify-end items-center">
          <div className="hidden sm:flex text-sm mr-12">
            <InfoSpanToken title={"TXS"} value={orders ? orders.length : 0} />
            <div className="flex items-center border border-tsuka-400 pt-1 mx-2">
              <label className="absolute -mt-16 mx-auto ml-1 bg-tsuka-700 px-2 text-tsuka-200">
                ORDERS
              </label>
              <InfoSpanToken title={"BUY"} value={buyOrders} />
              <InfoSpanToken title={"SELL"} value={sellOrders} />
            </div>
            <InfoSpanToken
              title={"VOL."}
              value={`$${defaultNumberFormat(tokenVolume.value ?? 0)} ${
                tokenVolume.currencyLabel
              }`}
            />
            {token_price && (
              <InfoSpanToken
                title={"24hr"}
                value={`${defaultNumberFormat(
                  oldTokenPrice
                    ? ((token_price.base_price - oldTokenPrice) /
                        oldTokenPrice) *
                        100
                    : 0
                ).toString()}%`}
                isPositive={token_price.base_price > oldTokenPrice}
              />
            )}
          </div>
          {token_price ? (
            <div className="text-sm justify-end">
              <div className="flex flex-col lg:flex-row items-end justify-end">
                <div className="text-tsuka-50 xs:ml-2 text-base xs:text-xl md:text-2xl">
                  ${token_price && (
                    <>
                      {token_price.base_price >= 0.01
                        ? handleNumberFormat(
                            parseFloat(token_price.base_price.toFixed(2))
                          )
                        : convertLawPrice(token_price.base_price)}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm justify-end">
              <div className="flex flex-col lg:flex-row items-end justify-end">
                <div className="text-tsuka-50 xs:ml-2 text-base xs:text-xl md:text-2xl">
                  <p className="text-sm">
                    Loading price...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
};
