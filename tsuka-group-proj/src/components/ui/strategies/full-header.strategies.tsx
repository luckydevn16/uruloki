import { StrategyStatusEnum } from "@/types/strategy.type";
import Link from "next/link";
import { useMemo } from "react";
import { MdArrowBack } from "react-icons/md";
import { Setup } from "@/lib/setups";

export interface FullHeaderStrategiesProps {
  strategyDetails: Setup;
  status: "ok" | "loading" | "failed";
}

export const FullHeaderStrategies: React.FC<FullHeaderStrategiesProps> = ({
  strategyDetails,
  status,
}) => {
  const statusTextColor = useMemo((): string => {
    switch (strategyDetails?.status) {
      case StrategyStatusEnum.ACTIVE:
        return "text-green-400";

      case StrategyStatusEnum.CANCELLED:
        return "text-red-400";

      case StrategyStatusEnum.EXECUTED:
        return "text-blue-400";

      default:
        return "text-blue-400";
    }
  }, [strategyDetails?.status]);

  return (
    <div className="w-full text-tsuka-300 flex items-start py-2 mb-4 flex-col md:items-center md:flex-row">
      <Link
        href="/strategies"
        className="text-xl p-2 rounded-full cursor-pointer"
      >
        <MdArrowBack />
      </Link>
      {status === "loading" && "Loading..."}
      {!strategyDetails && "Strategy ID not found"}
      {status === "ok" && strategyDetails && (
        <>
          <div className="flex w-full items-start md:items-center justify-center flex-col md:flex-row">
            <div className="px-2 flex-1 flex-col">
              <p className="text-3xl">
                #{strategyDetails.id}
                <label className="text-tsuka-50 font-medium ml-3">
                  {strategyDetails?.title}
                </label>
              </p>
              <div className="flex items-start mt-2 flex-col md:flex-row">
                <label className="text-xs whitespace-nowrap">
                  <label className={`${statusTextColor} text-xs`}>
                    {strategyDetails?.status}
                  </label>
                </label>
                <label className="text-xs whitespace-nowrap md:ml-4">
                  Created on:{" "}
                  <label className="text-xs text-tsuka-50">
                    {new Date(
                      Number(strategyDetails?.createdAt) * 1000
                    ).toDateString()}
                  </label>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
