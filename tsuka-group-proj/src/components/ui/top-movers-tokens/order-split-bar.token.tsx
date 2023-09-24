import { calculatePercentIncrease } from "@/helpers/calc.helper";

export interface OrderSplitBarProps {
  buyOrderCount: number;
  sellOrderCount: number;
}

export const OrderSplitBar: React.FC<OrderSplitBarProps> = ({
  buyOrderCount,
  sellOrderCount,
}) => {
  const percentPositive = calculatePercentIncrease(
    buyOrderCount,
    sellOrderCount
  );
  const percentNegative = 100 - percentPositive;

  return (
    <div className="w-full">
      <div className="w-full rounded-md h-1.5 bg-custom-red text-end text-tsuka-700 font-medium flex items-center">
        <div
          className={`bg-custom-green h-1.5 rounded-l-md`}
          style={{
            width: `${percentPositive}%`,
          }}
        ></div>
        <div className="w-0.5 h-3 bg-white"></div>
        {/* <span className="w-full px-2"></span> */}
      </div>
      <div className="w-full mt-2 text-[12px] leading-4 flex items-stretch">
        <div className="w-full text-start">
          <span className="text-tsuka-100">Buy : </span>
          <span className="text-custom-green">{buyOrderCount}</span>
        </div>
        <div className="w-full text-end">
          <span className="text-tsuka-100">Sell : </span>
          <span className="text-custom-red">{sellOrderCount}</span>
        </div>
      </div>
    </div>
  );
};
