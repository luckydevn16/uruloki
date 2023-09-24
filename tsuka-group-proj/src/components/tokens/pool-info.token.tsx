import { poolInfoData } from "@/@fake-data/pool-info.fake-data";
import { Pool } from "@/types/pool.type";
import { useEffect, useState } from "react";
import { FiArrowDown } from "react-icons/fi";
import { DefaultButton } from "../ui/buttons/default.button";

export interface PoolInfoTokenProps {
  token: {
    id: string;
  };
}

export const PoolInfoToken: React.FC<PoolInfoTokenProps> = ({ token }) => {
  const [value, setValue] = useState<Pool>();
  const [status, setStatus] = useState<"ok" | "loading" | "failed">("ok");

  useEffect(() => {
    // TODO: from fake data, set loading
    const data = poolInfoData.find((item) => item.id === token?.id)!;
    setValue({ ...data });
  }, [token]);

  return (
    <div className="bg-tsuka-500 mt-4 rounded-xl text-tsuka-100 p-6">
      <p className="text-tsuka-50 text-xl font-semibold mb-6">Pool Info</p>
      {status === "loading" && "Loading..."}
      {status === "ok" && value?.pool && (
        <div className="flex flex-col text-sm">
          <p className="mb-4 grid grid-cols-2">
            <label>Total Liquidity:</label>
            <label className="text-tsuka-50">
              ${value.pool.totalLiq.value}
              {value.pool.totalLiq.unit}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>24 Volume:</label>
            <label className="text-tsuka-50">
              ${value.pool.dayVolume.value}
              {value.pool.dayVolume.unit}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Market Cap:</label>
            <label className="text-tsuka-50">
              ${value.pool.marketCap.value}
              {value.pool.marketCap.unit}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Circ. Supply:</label>
            <label className="text-tsuka-50">
              {value.pool.circSupply.value}
              {value.pool.circSupply.unit} {value.pool.circSupply.code}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Total Market Cap:</label>
            <label className="text-tsuka-50">
              ${value.pool.totalMarketCap.value}
              {value.pool.totalMarketCap.unit}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Total Supply:</label>
            <label className="text-tsuka-50">
              {value.pool.totalSupply.value}
              {value.pool.totalSupply.unit} {value.pool.totalSupply.code}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Holders:</label>
            <label className="text-tsuka-50">
              {value.pool.holders.value}
              {value.pool.holders.unit}
            </label>
          </p>
          <p className="mb-4 grid grid-cols-2">
            <label>Total TX:</label>
            <label className="text-tsuka-50">
              {value.pool.totalTx.value}
              {value.pool.totalTx.unit}
            </label>
          </p>
        </div>
      )}

      <DefaultButton
        label="Show more"
        callback={() => console.log("default click")}
        Icon={FiArrowDown}
        enabled={true}
      />
    </div>
  );
};
