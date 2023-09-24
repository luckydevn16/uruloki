import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import * as coinhelper from "../../helpers/coin.helper";
import Marquee from "react-fast-marquee";

export interface CoinTypeProps {
  coins: CoinType[];
}

interface CoinType {
  url: string;
  name: string;
  abbr: string;
  price: number;
  rate: number;
}

export const CoinTypeLanding: React.FC<CoinTypeProps> = ({ coins }) => {
  return (
    <div className="inner-container bg-black py-4 overflow-hidden">
      <Marquee gradient={false}>
        <div className="w-full flex items-center">
          {coins.map((cointype) => {
            return (
              <div
                key={cointype.name}
                className="flex text-white items-center "
              >
                <Image
                  src={cointype.url}
                  alt="cointype__image"
                  width={24}
                  height={24}
                ></Image>
                <h1 className="text-base font-normal font-Steradian-400 text-[#828AA0] pl-2">
                  {cointype.name}
                </h1>
                <h2 className="text-sm leading-6 font-normal font-Steradian-400 text-[#676F84] uppercase pl-1">
                  {cointype.abbr}
                </h2>
                <h3 className="pl-14 text-sm font-normal font-Steradian-400 text-[#828AA0]">
                  {coinhelper.formatCurrencyFixed2(cointype.price)}
                </h3>
                <h4 className="text-[#6FCF97] flex text-sm font-Steradian-400 items-center pl-1 pr-20">
                  <FiArrowUpRight fontSize={20} />
                  {coinhelper.formatSignedPercent(cointype.rate)}
                </h4>
              </div>
            );
          })}
        </div>
      </Marquee>
    </div>
  );
};
