import { IconType } from "react-icons";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { useEffect, useState } from "react";
import { local } from "web3modal";

export interface DefaultButtonProps {
  label: string;
  callback: () => void;
  filled?: boolean;
  Icon?: IconType;
  RightIcon?: IconType;
  walletRequired?: boolean; //True if the user needs to connect a wallet to access the button
  enabled: boolean;
}

export const DefaultButton: React.FC<DefaultButtonProps> = ({
  label,
  callback,
  filled,
  Icon,
  RightIcon,
  walletRequired,
  enabled,
}) => {
  const [isConnected, setIsConnected] = useState<any>();
  useEffect(() => {
    setIsConnected(localStorage.getItem("wagmi.connected"));
    setInterval(() => {
      setIsConnected(
        localStorage.getItem("wagmi.connected")
          ? localStorage.getItem("wagmi.connected")
          : ""
      );
    }, 10);
    //
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        if (isConnected || !walletRequired) {
          callback();
        }
      }}
      disabled={!enabled}
      className={`
      ${
        isConnected || !walletRequired
          ? "hover:bg-custom-primary/90 cursor-pointer"
          : "bg-white-600 cursor-default"
      }
      ${!enabled ? "opacity-50 cursor-default" : "opacity-100 cursor-pointer"}
      ${
        filled
          ? "text-white bg-custom-primary"
          : "text-custom-primary hover:text-custom-primary/90"
      }
      ${!enabled && "bg-[#4D556A]"}
      w-full text-center focus:outline-none rounded-md text-sm px-5 py-2 inline-flex justify-center items-center mr-2 transition-all create-order-button`}
    >
      {!isConnected && walletRequired && (
        <span className="tooltiptext">Connect your wallet</span>
      )}
      {Icon && (
        <label className="mr-1">
          <Icon />
        </label>
      )}
      {label}
      {RightIcon && (
        <label className="ml-1">
          <RightIcon />
        </label>
      )}
    </button>
  );
};
