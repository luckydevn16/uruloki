import { calculatePercentIncrease } from "@/helpers/calc.helper";

export interface BarBuySellTokenProps {
  buyValue: number;
  sellValue: number;
}

export const BarBuySellToken: React.FC<BarBuySellTokenProps> = ({
  buyValue,
  sellValue, 
}) => {
  const percentPositive = calculatePercentIncrease(buyValue, sellValue);
  const percentNegative = 100 - percentPositive;

  return (
    <div className="w-full">
      <div className="w-full rounded-md h-6 bg-custom-red text-end text-tsuka-700 font-medium flex items-center">
        <div
          className="bg-custom-green h-6 rounded-l-md text-start flex items-center px-2 border-r-4 border-tsuka-500"
          style={{
            width: `${percentPositive * 2}%`,
          }}
        >
          {percentPositive}%
        </div>
        <span className="w-full px-2">{percentNegative}%</span>
      </div>
      <div className="w-full mt-2 flex items-stretch">
        <div className="w-full text-start">${buyValue}</div>
        <div className="w-full text-end">${sellValue}</div>
      </div>
    </div>
  );
};
