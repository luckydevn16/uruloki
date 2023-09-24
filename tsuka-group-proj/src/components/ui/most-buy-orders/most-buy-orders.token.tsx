import { IMostBuyOrdersTokenProps } from "@/global";
import { commafy } from "@/helpers/calc.helper";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiRefreshCcw } from "react-icons/fi";

export const MostBuyOrders: React.FC<IMostBuyOrdersTokenProps> = ({
  mostBuyOrders,
}) => {
  const router = useRouter(); 

  return (
    <div className="w-full md:w-1/3 bg-tsuka-500 p-6 rounded-2xl text-tsuka-300">
      <div className="flex justify-between">
        <span className="text-tsuka-50 text-[18px] font-medium">
          Most Buy Orders
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
              <th className="py-2 text-right md:text-left">Buy Orders</th>
            </tr>
          </thead>
          <tbody>
            {mostBuyOrders.map((mostBuyOrder, idx) => {
              return (
                mostBuyOrder.token.name && (
                  <tr
                    onClick={() => {
                      router.push(`/pair/${mostBuyOrder.token.pair_address}`);
                    }}
                    className="cursor-pointer border-t border-t-tsuka-400"
                    key={idx}
                  >
                    <td className="py-2 md:py-5">
                      {mostBuyOrder.rank >= 1 && mostBuyOrder.rank <= 3 ? (
                        <Image
                          src={`/icons/medal${mostBuyOrder.rank}.png`}
                          width={24}
                          height={24}
                          alt={"medal" + mostBuyOrder.rank}
                        />
                      ) : (
                        <span className="ml-1 text-tsuka-200 text-[16px] leading-[20px] font-medium">
                          #{idx}
                        </span>
                      )}
                    </td>
                    <td className="py-2 md:py-5 flex items-center">
                      <div className="ml-2 flex flex-col md:flex-row gap-1 md:gap-0">
                        <p className="text-tsuka-50 text-[16px] leading-[20px] font-normal">
                          {mostBuyOrder.token.name}
                        </p>
                        <p className="text-tsuka-200 text-[14px] leading-[18px] font-normal ml-0 md:ml-1">
                          {mostBuyOrder.token.shortName}
                        </p>
                      </div>
                    </td>
                    <td className="py-2 md:py-5 text-right md:text-left">
                      <span className="text-tsuka-200">
                        {commafy(mostBuyOrder.buyOrders)}
                      </span>
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
