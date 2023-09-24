import { ITopGainersTokenProps } from "@/global";
import { commafy } from "@/helpers/calc.helper";
import { formatNumberToHtmlTag } from "@/helpers/coin.helper";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiArrowUpRight, FiRefreshCcw } from "react-icons/fi";

export const TopGainers: React.FC<ITopGainersTokenProps> = ({ topGainers }) => {
  const router = useRouter();
  return (
    <div className="w-full md:w-1/3 bg-tsuka-500 p-6 rounded-2xl text-tsuka-300">
      <div className="flex justify-between">
        <span className="text-tsuka-50 text-[18px] font-medium">
          Top Gainers
        </span>
        <Link
          className="flex items-center text-xs text-custom-primary"
          href="#"
        >
          <FiRefreshCcw className="mr-1" />
          Auto-Refreshed in 5 sec.
        </Link>
      </div>

      <div className="scrollable pr-1 h-[270px] md:h-[294px] overflow-y-auto overflow-x-auto mt-5">
        <table className="w-full text-left">
          <thead className="">
            <tr className="text-tsuka-300 text-[14px] leading-[18px] font-medium">
              <th className="py-2 text-center pr-2">#</th>
              <th className="py-2">Token</th>
              <th colSpan={2} className="py-2 text-center xl:text-left">
                Price(USD)
              </th>
              {/* <th className="py-2 text-right md:text-center"></th> */}
            </tr>
          </thead>
          <tbody>
            {topGainers?.map((topGainer, idx) => {
              let priceEle;
              if (topGainer.price >= 0.01) {
                // console.log("topgainer price >: ", topGainer.price);
                priceEle = `$${commafy(topGainer.price)}`;
              } else {
                // console.log("topgainer price <: ", topGainer.price);

                priceEle = (
                  <>
                    ${formatNumberToHtmlTag(topGainer.price).integerPart}.0
                    <sub>
                      {formatNumberToHtmlTag(topGainer.price).leadingZerosCount}
                    </sub>
                    {formatNumberToHtmlTag(topGainer.price).remainingDecimal}
                  </>
                );
              }
              return (
                topGainer.token.name &&
                topGainer.token.name !== "-" && (
                  <tr
                    onClick={() => {
                      router.push(`/pair/${topGainer.token.pair_address}`);
                    }}
                    className="cursor-pointer border-t border-t-tsuka-400"
                    key={idx}
                  >
                    <td className="py-2 md:py-5 text-right md:text-left">
                      {topGainer.rank >= 1 && topGainer.rank <= 3 ? (
                        <Image
                          src={`/icons/medal${topGainer.rank}.png`}
                          width={24}
                          height={24}
                          alt={"medal" + topGainer.rank}
                        />
                      ) : (
                        <span className="ml-1 mr-2 text-tsuka-200 text-[16px] leading-[20px] font-normal">
                          #{idx}
                        </span>
                      )}
                    </td>
                    <td className="py-2 md:py-5 flex items-center">
                      <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0 flex-shrink">
                        <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal hidden xl:block">
                          {topGainer.token.name}
                        </p>
                        <p className="xl:text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1 text-tsuka-50">
                          {topGainer.token.shortName}
                        </p>
                      </div>
                    </td>
                    <td className="py-2 md:py-5 w-16 text-right xl:text-left">
                      <span className="text-tsuka-200">{priceEle}</span>
                    </td>
                    <td className="py-2 md:py-5 text-right xl:text-left">
                      <div className="ml-2 flex text-[#6FCF97]">
                        <FiArrowUpRight className="mt-0.5" />
                        <span>{`${topGainer.risingPercent.toLocaleString()}%`}</span>
                      </div>
                    </td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
