import React, { useState, useEffect } from "react";
import { OrderBookPosition } from "@/types/token-positions.type";
import { tokenPositionsData } from "@/@fake-data/token-positions.fake-data";
import { splitAddress } from "@/helpers/splitAddress.helper";
import { numberWithCommas } from "@/helpers/comma.helper";
import { commafy } from "@/helpers/calc.helper";
import { formatNumberToHtmlTag } from "@/helpers/coin.helper";
import { HistoricalDexTrades } from "@/lib/token-activity-feed";

const subPrice = (price: number) => {
  let priceEle;
  if (price >= 0.01) {
    // console.log("topgainer price >: ", topGainer.price);
    priceEle = `$${price.toLocaleString("en-us")}`;
  } else {
    // console.log("topgainer price <: ", topGainer.price);

    priceEle = (
      <>
        ${formatNumberToHtmlTag(price).integerPart}.0
        <sub>{formatNumberToHtmlTag(price).leadingZerosCount}</sub>
        {formatNumberToHtmlTag(price).remainingDecimal}
      </>
    );
  }
  return priceEle;
};
export interface OrderBookTokenProps {
  dexTrades: Array<HistoricalDexTrades>;
}

interface TradeRowProps {
  item: HistoricalDexTrades;
}

const TradeRow: React.FC<TradeRowProps> = ({ item }) => {
  return (
    <div
      className={`${
        item.side == "BUY" || item.side == "Buy"
          ? "text-green-400"
          : "text-red-400"
      } border-b border-tsuka-400 text-base relative w-full text-left flex flex-center`}
    >
      <span className=" py-2 w-[120px] ml-4 text-sm font-normal whitespace-nowrap">
        {item.side}
      </span>
      <span className=" py-2 w-[190px] text-sm font-normal whitespace-nowrap">
        {subPrice(Number(item.tradeAmount))}
      </span>
      <span className="py-2 text-sm font-normal whitespace-nowrap w-[384px]">
        {item.transaction.txFrom.address}
      </span>
      {item.tokenPairInfo?.baseToken && item.tokenPairInfo?.pairedToken && (
        <span className="py-2 text-sm font-normal whitespace-nowrap w-[194px]">
          {item.tokenPairInfo.baseToken.symbol} /{" "}
          {item.tokenPairInfo.pairedToken.symbol}
        </span>
      )}
      <span className="py-2 text-sm font-normal whitespace-nowrap">
        {item.timestamp}
      </span>
    </div>
  );
};

export const OrderHistoryBookTokenUi: React.FC<OrderBookTokenProps> = ({
  dexTrades,
}) => {
  return (
    <div>
      <div className="flex p-4">
        <div className="flex-1">
          <div className="h-96 scrollable overflow-y-auto overflow-x-auto">
            <div className="flex text-base text-left border-b flex-center text-tsuka-300 border-tsuka-400">
              <span className="px-4 py-2 w-[120px]">Type</span>
              <span className="px-4 py-2 w-[190px]">Amount (USD)</span>
              <span className="px-4 py-2 w-[384px]">Buyer Address</span>
              <span className="px-4 py-2 w-[194px]">Base / Quote</span>
              <span className="px-4 py-2">Date</span>
            </div>
            {dexTrades &&
              dexTrades.map((item: any, index: number) => (
                <TradeRow key={index} item={item} />
              ))}
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};
