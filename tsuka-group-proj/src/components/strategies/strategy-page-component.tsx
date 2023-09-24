import {
  OrderToken,
  Strategy,
  StrategyStatusEnum,
} from "@/types/strategy.type";
import Link from "next/link";
import { useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { StatusSpan } from "../ui/spans/status.span";
import { DefaultButton } from "../ui/buttons/default.button";
import { FiPlusCircle } from "react-icons/fi";
import CreateSetupModal from "./create-setup-modal";
import Table from "./table/table";

export interface StrategiesPageComponentProps {
  strategies: Array<Strategy>;
  onLoad: () => void;
}

export const StrategiesPageComponent: React.FC<
  StrategiesPageComponentProps
> = ({ strategies, onLoad }) => {
  const [selectedPath, setSelectedPath] = useState("strategies-list");
  const [showCreateSetupModal, setShowCreateSetupModal] =
    useState<boolean>(false);

  const options = [
    {
      title: "List of Setups",
      path: "strategies-list",
    },
  ]; 

  console.log(strategies)

  return (
    <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100 mb-16">
      <div className="w-full flex items-center justify-start px-2 pt-2">
        {options.map(({ title, path }, index) => (
          <span
            key={index}
            onClick={() => setSelectedPath(path)}
            className={`p-4 md:text-center mx-2 text-sm text-left md:text-lg font-semibold text-tsuka-50 cursor-pointer`}
          >
            {title}
          </span>
        ))}
        <div className="ml-auto p-4">
          <DefaultButton
            label="Create Setup"
            callback={() => {
              setShowCreateSetupModal(true);
            }}
            filled={true}
            Icon={FiPlusCircle}
            enabled={true}
          />
        </div>
        {showCreateSetupModal && (
          <CreateSetupModal
            onClose={({ success }: { success: boolean }) => {
              if (success) {
                onLoad();
              }
              setShowCreateSetupModal(false);
            }}
          />
        )}
      </div>
      <div>
        {strategies && (
          <div className="p-4 flex">
            <div className="flex-1 overflow-x-scroll scrollable">
              <Table strategies={strategies} onLoad={onLoad}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
