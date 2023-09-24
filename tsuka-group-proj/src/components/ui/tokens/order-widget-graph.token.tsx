import { DeleteConfirmToken } from "@/components/ui/my-order/delete-confirm.token";
import { EditOrDeleteToken } from "@/components/ui/my-order/edit-or-delete.token";
import { ChartBound } from "@/types/chart-bound.type";
import { OrderStatusEnum } from "@/types/token-order.type";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaClock, FaSync } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import {
  convertLawPrice,
  handleNumberFormat,
} from "@/lib/number-helpers";

export interface OrderWidgetGraphProp {
  id: number;
  buy: boolean;
  isContinuous: boolean;
  value1: number;
  value2?: number;
  budget: number;
  bound: ChartBound;
  status: string;
  setShowEditOrderModal: (a: any, b: any) => void;
  setShowDeletedAlert: (a: any) => void;
  tokenSymbol: string;
  pairedTokenSymbol: string;
}

export const OrderWidgetGraph: React.FC<OrderWidgetGraphProp> = ({
  id,
  buy,
  isContinuous,
  value1,
  value2,
  budget,
  bound: { min, max },
  status,
  setShowEditOrderModal,
  setShowDeletedAlert,
  tokenSymbol,
  pairedTokenSymbol,
}) => {
  const [showEditOrDelete, setShowEditOrDelete] = useState<boolean>(false);
  const [showConfirmDlg, setShowConfirmDlg] = useState<boolean>(false);

  const percents = useMemo(() => {    
    if (max !== 0 && min !== 0) {
      const range = max - min;
      const percent1 = ((value1 - min) / range) * 90 + 10;
      const percent2 = value2 ? ((value2 - min) / range) * 90 + 10 : undefined;
      return [percent1, percent2];
    } else {
      const range = 1;
      const percent1 = ((value1 - min) / range) * 90 + 10;
      const percent2 = value2 ? ((value2 - min) / range) * 90 + 10 : undefined;
      return [percent1, percent2];
    }
  }, [value1, value2, min, max]);

  const handleShowEditOrderModal = (show: boolean) => {
    setShowEditOrderModal(show, id);
  };

  // const statusColor =
  //   status === OrderStatusEnum.ACTIVE
  //     ? "text-custom-primary"
  //     : "text-tsuka-100";
  const statusColor = useMemo((): { text: string; bg: string } => {
    switch (status) {
      case OrderStatusEnum.ACTIVE:
        return { text: "text-green-400", bg: "bg-green-400" };

      case OrderStatusEnum.CANCELLED:
        return { text: "text-red-400", bg: "bg-red-400" };

      case OrderStatusEnum.EXECUTED:
        return { text: "text-blue-400", bg: "bg-blue-400" };

      default:
        return { text: "text-blue-400", bg: "bg-blue-400" };
    }
  }, [status]);

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between px-4 py-2 border border-b-0 border-tsuka-400 text-tsuka-50">
        <p className="flex items-center gap-2">
          {buy ? "BUY" : "SELL"}{" "}
          {isContinuous ? (
            <FaSync className="text-custom-green mr-2" />
          ) : (
            <FaClock className="text-custom-red mr-2" />
          )}
        </p>
        <div className="text-end">
          <div className="flex items-center font-medium">
            <div
              className={`w-1 h-1 mr-1 rounded-full ${statusColor.bg}`}
            ></div>
            <span className={statusColor.text}>
              {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
            </span>
          </div>
        </div>

        <div className="relative">
          <span
            className="text-custom-primary flex items-center gap-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowEditOrDelete(true);
            }}
          >
            Edit <FiEdit />
          </span>
          {showEditOrDelete && (
            <EditOrDeleteToken
              setShowEditOrDelete={setShowEditOrDelete}
              setShowEditOrderModal={handleShowEditOrderModal}
              setShowConfirmDlg={setShowConfirmDlg}
              status={status}
            />
          )}
          {showConfirmDlg && (
            <DeleteConfirmToken
              setShowConfirmDlg={setShowConfirmDlg}
              deleteID={id}
              setShowDeletedAlert={setShowDeletedAlert}
            />
          )}
        </div>
      </div>
      <div className="border border-tsuka-400 text-tsuka-100">
        <div className="py-2 px-4 text-sm text-tsuka-100">
          <div className="mb-2 flex justify-between">
            <span className={buy ? "text-custom-green" : "text-custom-red"}>
              {value2 ? "Price range" : "Target price"}
            </span>
            <span>
              $
              {value1 >= 0.01
                ? handleNumberFormat(parseFloat(value1.toFixed(2)))
                : convertLawPrice(value1)}
              {!!value2 && (
                <>
                  $
                  {value2 >= 0.01
                    ? handleNumberFormat(parseFloat(value2.toFixed(2)))
                    : convertLawPrice(value2)}
                </>
              )
                ? " - $" +
                  (value2 >= 0.01
                    ? handleNumberFormat(parseFloat(value2.toFixed(2)))
                    : convertLawPrice(value2))
                : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Budget</span>
            <span>
              {budget >= 0.01
                ? handleNumberFormat(parseFloat(budget.toFixed(2)))
                : convertLawPrice(budget)}{" "}
              {buy ? pairedTokenSymbol : tokenSymbol}
            </span>
          </div>
        </div>
        <div className="flex mt-4">
          <div
            className={`${
              buy ? "from-custom-green/10" : "from-custom-red/10"
            } w-full h-10 bg-gradient-to-t to-transparent relative`}
          >
            {percents.map(
              (percent, index) =>
                percent && (
                  <div
                    key={index}
                    className={`${
                      buy ? "border-custom-green" : "border-custom-red"
                    } border-r-4 h-10 absolute ${
                      index === 0
                        ? `${
                            buy
                              ? "from-custom-green/30 bg-gradient-to-t"
                              : "from-custom-red/30 bg-gradient-to-t"
                          }`
                        : `bg-tsuka-500 ${
                            buy ? "from-custom-green/10" : "from-custom-red/10"
                          } bg-gradient-to-t`
                    }`}
                    style={
                      !percents[1]
                        ? { marginLeft: `${percent}%` }
                        : { width: `${percent}%` }
                    }
                  />
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
