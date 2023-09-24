import { OrderSplitBar } from "@/components/ui/top-movers-tokens/order-split-bar.token";
import { ITopMover, ITopMoversTokenProps } from "@/global";
import { commafy, commafy2 } from "@/helpers/calc.helper";
import { splitAddress } from "@/helpers/splitAddress.helper";
import { commafyOrHtmlTag } from "@/lib/number-helpers";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiSearch,
} from "react-icons/fi";

export const TopMoversTokens: React.FC<ITopMoversTokenProps> = ({
  topMovers,
}) => {
  // console.log(topMovers);
  const [collapeds, setCollapeds] = useState<boolean[]>([]);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ITopMover[]>([]);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = ev;
    setSearchQuery(value);
    searchTopMovers();
  };

  const searchTopMovers = () => {
    if (searchQuery !== "") {
      const searchResults = topMovers.filter(
        item => (
          item.token.toLowerCase().includes(searchQuery.toLowerCase())
          || item.pair_address.toLowerCase().includes(searchQuery.toLowerCase())
          || item.chain.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setItems(searchResults);
    } else {
      setItems(topMovers);
    }
  }

  useEffect(() => {
    searchTopMovers();
    let tempArray: boolean[] = [];
    for (let i = 0; i < items.length; i++) {
      tempArray[i] = true;
    }
    setCollapeds(tempArray);
  }, []);

  const toggle = (idx: number) => {
    let newValue = !collapeds[idx];
    let newArray = [...collapeds];
    newArray[idx] = newValue;
    setCollapeds(newArray);
  };

  return (
    <div className="w-full bg-tsuka-500 p-6 rounded-2xl text-tsuka-300">
      <div className={`md:flex justify-between items-center`}>
        <h1 className="mb-3 md:mb-0text-[18px] md:text-[24px] leading-6 md:leading-8 font-medium text-tsuka-50">
          Top Movers Tokens (24hr)
        </h1>
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="grow md:grow-0 flex items-center text-sm text-tsuka-100">
            <FiSearch className="ml-4 -mr-7 z-10 text-tsuka-300" />
            <input
              type="text"
              className="w-full md:w-[200px] border border-tsuka-400 bg-tsuka-500 rounded-md pl-8 pr-3 py-[11px] focus:outline-0 placeholder-tsuka-300"
              placeholder="Find tokens..."
              value={searchQuery}
              onChange={handleChange}
            />
          </div>
          <button
            type="button"
            className={`px-3 py-[11px] border border-tsuka-400 focus:outline-none bg-tsuka-500 text-tsuka-100 rounded-md text-sm flex items-center`}
          >
            <label className="mr-1 text-tsuka-200 text-base">
              <FiFilter />
            </label>
            Filters
          </button>
        </div>
      </div>

      <div className={"scrollable w-full relative overflow-x-auto"}>
        <table className="w-full text-left mt-4">
          <thead className="">
            <tr className="text-tsuka-300 text-[14px] leading-[18px] font-medium">
              <th className="py-2 pl-2">#</th>
              <th className="py-2 hidden md:table-cell">Contract</th>
              <th className="py-2 hidden md:table-cell">Token</th>
              <th className="py-2">Chain</th>
              <th colSpan={2} className="py-2 text-center md:text-left">
                Price(USD)
              </th>
              {/* <th className="py-2 text-right md:text-left"></th> */}
              <th className="py-2 hidden md:table-cell">Volume</th>
              <th className="py-2 hidden md:table-cell">Market Cap</th>
              <th className="py-2 hidden md:table-cell">Total Orders</th>
              <th className="py-2 hidden md:table-cell">Order Split</th>
              <th className="md:hidden"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((topMover, idx) => {
              /// TODO: This is only for test
              let shortName = "ETH";
              let id = "ethereum";
              let priceEle = commafyOrHtmlTag(topMover.price)
              return (
                topMover.token &&
                topMover.token !== "-" && (
                  <Fragment key={idx}>
                    <tr
                      onClick={() => {
                        router.push(`/pair/${topMover.pair_address}`);
                      }}
                      className="cursor-pointer border-t border-t-tsuka-400"
                    >
                      <td className="py-2 md:py-8">
                        <span className="ml-1 text-tsuka-200 text-[16px] leading-[20px] font-medium">
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="hidden md:table-cell py-2 md:py-8">
                        <span className="ml-1 text-tsuka-50 text-[16px] leading-[20px] font-normal">
                          {splitAddress(topMover.pair_address as string)}
                        </span>
                      </td>
                      <td className="hidden md:table-cell py-2 md:py-8">
                        <span className="ml-1 text-tsuka-50 text-[16px] leading-[20px] font-normal">
                          {topMover.token.length > 20 ? (
                            topMover.token.slice(0,20) + "..."
                          ) : (
                            topMover.token
                          )}
                        </span>
                      </td>
                      <td className="py-2 md:py-8 flex items-center">
                        <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0">
                          <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal">
                            {shortName}
                          </p>
                          {/* <p className="text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1">
                          {topMover.chain.shortName}
                        </p> */}
                        </div>
                      </td>
                      <td className="py-2 md:py-8 w-16 text-right md:text-left">
                        {/* <div className="flex gap-1 md:gap-0 flex-col md:flex-row items-end md:items-center text-[14px] leading-[18px] font-normal"> */}
                        <span className="text-tsuka-200">{priceEle}</span>

                        {/* </div> */}
                      </td>
                      <td className="py-2 md:py-8 text-right md:text-left">
                        {/* <div className="flex gap-1 md:gap-0 flex-col md:flex-row items-end md:items-center text-[14px] leading-[18px] font-normal"> */}
                        {topMover.risingPercent > 0 ? (
                          <div className="flex text-custom-green">
                            <FiArrowUpRight className="mt-0.5" />
                            <span>{`${topMover.risingPercent.toLocaleString(
                              "en-us"
                            )}%`}</span>
                          </div>
                        ) : (
                          <div className="flex text-custom-red">
                            <FiArrowDownRight className="mt-0.5" />
                            <span>{`${(
                              0 - topMover.risingPercent
                            ).toLocaleString("en-us")}%`}</span>
                          </div>
                        )}
                        {/* </div> */}
                      </td>
                      <td className="hidden md:table-cell py-2 md:py-8">
                        <span className="text-tsuka-200">{`$${commafy(
                          topMover.volume
                        )}`}</span>
                      </td>
                      <td className="hidden md:table-cell py-2 md:py-8">
                        <span className="text-tsuka-200">{`$${commafy(
                          topMover.marketCap
                        )}`}</span>
                      </td>
                      <td className="hidden md:table-cell py-2 md:py-8">
                        <span className="text-tsuka-200">{`${commafy(
                          topMover.orderCount
                        )}`}</span>
                      </td>
                      <td className="hidden md:table-cell">
                        <OrderSplitBar
                          buyOrderCount={topMover.buyOrderCount}
                          sellOrderCount={topMover.sellOrderCount}
                        />
                      </td>
                      <td
                        className="md:hidden pl-2"
                        onClick={() => toggle(idx)}
                      >
                        {collapeds[idx] ? <FiChevronDown /> : <FiChevronUp />}
                      </td>
                    </tr>
                    {!collapeds[idx] && (
                      <tr className="md:hidden">
                        <td colSpan={4}>
                          <div className="w-full bg-tsuka-400 rounded-lg p-3 mb-2">
                            <div className="w-full flex justify-between">
                              <span className="text-[14px] leading-[18px] text-tsuka-100">
                                Chain
                              </span>
                              <span className="text-[14px] leading-[18px] text-tsuka-100">
                                <span className="text-tsuka-50 mr-1">
                                  {topMover.chain.name}
                                </span>
                                <span>{topMover.chain.shortName}</span>
                              </span>
                            </div>
                            <hr className="border-tsuka-300 my-2" />
                            <div className="w-full flex justify-between">
                              <span className="text-[14px] leading-[18px] text-tsuka-100">
                                Volume
                              </span>
                              <span className="text-[14px] leading-[18px] text-tsuka-50">
                                {`$${commafy2(topMover.volume)}`}
                              </span>
                            </div>
                            <hr className="border-tsuka-300 my-2" />
                            <div className="w-full flex justify-between">
                              <span className="text-[14px] leading-[18px] text-tsuka-100">
                                Market Cap
                              </span>
                              <span className="text-[14px] leading-[18px] text-tsuka-50">
                                {`$${commafy2(topMover.marketCap)}`}
                              </span>
                            </div>
                            <hr className="border-tsuka-300 my-2" />
                            <div className="w-full flex justify-between">
                              <span className="text-[14px] leading-[18px] text-tsuka-100">
                                Total Orders
                              </span>
                              <span className="text-[14px] leading-[18px] text-tsuka-50">
                                {`${commafy2(topMover.orderCount)}`}
                              </span>
                            </div>
                            <div className="w-full mt-[11px]"></div>
                            <OrderSplitBar
                              buyOrderCount={topMover.buyOrderCount}
                              sellOrderCount={topMover.sellOrderCount}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
