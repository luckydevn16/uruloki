import { StrategyStatusEnum } from "@/types/strategy.type";
import { OrderStatusEnum } from "@/types/token-order.type";

export interface StatusSpanProps {
  status: OrderStatusEnum | StrategyStatusEnum;
}

export const StatusSpan: React.FC<StatusSpanProps> = ({ status }) => {
  const getStatusColors = (): { text: string; bg: string } => {
    switch (status) {
      case (StrategyStatusEnum.ACTIVE, OrderStatusEnum.ACTIVE):
        return { text: "text-green-400", bg: "bg-green-400" };

      case (StrategyStatusEnum.CANCELLED, OrderStatusEnum.CANCELLED):
        return { text: "text-red-400", bg: "bg-red-400" };

      case (StrategyStatusEnum.EXECUTED, OrderStatusEnum.EXECUTED):
        return { text: "text-blue-400", bg: "bg-blue-400" };

      default:
        return { text: "text-blue-400", bg: "bg-blue-400" };
    }
  };

  return (
    <div className="flex my-auto font-medium py-1">
      <span className={getStatusColors().text}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};
