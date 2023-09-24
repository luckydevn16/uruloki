import { commafy } from "@/helpers/calc.helper";
import { formatNumberToHtmlTag } from "@/helpers/coin.helper";
import { numberWithCommas } from "@/helpers/comma.helper";
import { commafyOrHtmlTag } from "@/lib/number-helpers";
import { OrderBookVolume } from "@/types/orderbook.type";

export const OrderBookHalf: React.FC<{
    data: Array<OrderBookVolume>, 
    isBuy: boolean, 
    baseTokenShortName: string, 
    pairTokenShortName: string,
    buyOrSellSum: number
}> = ({data, isBuy, baseTokenShortName, pairTokenShortName, buyOrSellSum}) => {
    let sum: number;

    return (
        <div className="flex-1">
            <div className="h-96">
              <div className="w-full text-base text-left flex flex-center text-tsuka-300 border-b border-tsuka-400">
                <span className="flex-1 px-4 py-2">Price (USD)</span>
                <span className="flex-1 px-4 py-2 text-end">
                  Size ({isBuy ? pairTokenShortName : baseTokenShortName})
                </span>
                <span className="flex-1 px-4 py-2 text-end">SUM ({isBuy ? pairTokenShortName : baseTokenShortName})</span>
              </div>
              {[...(data ?? [])]
                .sort((a, b) => a.price - b.price)
                .map((item, index) => {
                  if (!index) {
                    sum = item.size;
                  } else {
                    sum += item.size;
                  }
                  return (
                    <div
                      key={index}
                      className={`${isBuy ? "text-green-400" : "text-red-400"} border-b border-tsuka-400 text-base relative w-full text-left flex flex-center`}
                    >
                      <div className="absolute w-full rounded-lg m-2 pr-4">
                        <div
                          className={`${isBuy ? "bg-green-400/20" : "bg-red-400/20"} h-6 rounded text-start flex items-center px-2 ${isBuy? "mr-auto" : "ml-auto"}`}
                          style={{
                            width: `${(sum * 100) / buyOrSellSum}%`,
                          }}
                        ></div>
                      </div>
                      <span className="flex-1 py-2 px-4 text-sm font-normal whitespace-nowrap">
                        {commafyOrHtmlTag(item.price)}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {item.size.toLocaleString("en-us")}
                      </span>
                      <span className="flex-1 py-2 px-4 text-sm text-end font-normal whitespace-nowrap">
                        {commafyOrHtmlTag(sum, false)} {isBuy ? pairTokenShortName : baseTokenShortName}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
    )
}