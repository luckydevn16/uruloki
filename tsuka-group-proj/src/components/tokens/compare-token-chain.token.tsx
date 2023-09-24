import { compareTokenData } from "@/@fake-data/compare-token.fake-data";
import { Compare } from "@/types/compare.type";
import { useEffect, useState } from "react";
import { HorizontalIconsToken } from "../ui/tokens/horizontal-icons.token";

export interface CompareTokenChainTokenProps {
  token: {
    id: string;
    token: string;
  };
  networks: Array<string>;
}

export const CompareTokenChainToken: React.FC<CompareTokenChainTokenProps> = ({
  token,
  networks,
}) => {
  const [focusNetwork, setFocusNetwork] = useState(networks[0]);
  const [value, setValue] = useState<Compare[]>([]);
  const [status, setStatus] = useState<"ok" | "loading">("ok");

  useEffect(() => {
    // TODO: from fake data, set loading
    const data = compareTokenData.filter(
      (item) => item.inputToken.code === token.token
    );
    setValue([...data]);
  }, [token])

  return (
    <div className="bg-tsuka-500 rounded-xl text-tsuka-100 px-6 pt-6">
      <div className="flex items-center justify-between px-4 border-b mb-5 text-tsuka-300 border-tsuka-300">
        {networks?.map((net) => (
          <div
            key={net}
            onClick={() => setFocusNetwork(net)}
            className={`px-6 pb-3 cursor-pointer ${
              net === focusNetwork &&
              "border-b border-custom-primary text-custom-primary"
            }`}
          >
            {net}
          </div>
        ))}
      </div>
      <div className="h-96 overflow-auto">
        {status === "loading" && "Loading..."}
        {status === "ok" &&
          value?.map((item) => (
            <div
              key={item.inputToken.name}
              className="flex flex-row items-center mb-4"
            >
              <HorizontalIconsToken
                inputToken={item.inputToken}
                outputToken={item.outputToken}
              />
              <div className="px-2 flex-1 flex-col">
                <p className="text-sm">
                  <label className="text-tsuka-50 text-base font-semibold">
                    {item.inputToken.code}
                  </label>
                  /{item.outputToken.code}
                </p>
                <label className="text-xs">{item.network}</label>
              </div>
              <div className="text-sm text-end">
                <div className="text-tsuka-50">{item.value}</div>
                <div
                  className={`${
                    item.diference.operator === "+"
                      ? "text-custom-green"
                      : "text-custom-red"
                  }`}
                >
                  {item.diference.operator}
                  {item.diference.value}%
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
