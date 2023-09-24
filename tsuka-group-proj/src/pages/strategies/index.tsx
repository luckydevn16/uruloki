import { StrategiesPageComponent } from "@/components/strategies/strategy-page-component";
import { getConnectedAddress } from "@/helpers/web3Modal";
import { Strategies } from "@/lib/strategies/strategies";
import { Strategy } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StrategyDetails() {
  const [count, setCount] = useState<number>(0);
  const [connected, setConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true)
  const [strategies, setStrategies] = useState<Strategy[]>([]);

  const getWalletAddress = async () => {
    const walletAddress = await getConnectedAddress();
    
    if (!!walletAddress) {
      await setAddress(walletAddress as string);
      await setConnected(true);
    }

    await setCount(prev => prev + 1);
  }

  const onLoad = async() => {
    if (!!address) {
      const tempStrategies = await Strategies.Client.getStrategiesData(address);
      setStrategies(tempStrategies);      
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!connected) {
      getWalletAddress();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (!!address) {
      onLoad();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);
  
  return (
    <div className="relative px-4 md:px-10 pt-3 md:pt-6 pb-8">
      <div className="w-full gap-4 text-tsuka-300 flex py-2 mb-2 md:items-center justify-center md:justify-start flex-row">
        <Link
          href={"/strategies"}
          className={
            "text-[32px] md:text-[40px] leading-[36px] md:leading-[52px] font-medium text-tsuka-50"
          }
        >
          My Setups
        </Link>

        <Link
          href={"/my-orders"}
          className={
            "text-[24px] leading-[36px] md:leading-[52px] text-tsuka-200"
          }
        >
          My Orders
        </Link>
      </div>

      {strategies && (
        <StrategiesPageComponent strategies={strategies} onLoad={onLoad} />
      )}

      {loading && (
        <p className="text-white text-center">Loading...</p>
      )}
    </div>
  );
}
