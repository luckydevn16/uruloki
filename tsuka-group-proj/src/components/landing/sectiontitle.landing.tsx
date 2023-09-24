import Image from "next/image";
import { BlurLanding } from "./blur.landing";

export interface SectionTitleProps {
  mainText: string;
  beforeMainText: string;
  afterMainText: string;
  beforeTextStyle: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  mainText,
  beforeMainText,
  afterMainText,
  beforeTextStyle = false,
}) => {
  let BeforeStyle = beforeTextStyle
    ? "bg-gradient-to-r from-[#003525] to-[#31C699]"
    : "bg-[#ffffff44]";
  return (
    <div className="justify-center text-center relative ">
      <div className={`inline-block ${BeforeStyle} rounded-full p-[1px]`}>
        <h1 className=" text-white bg-black font-Inter-400 text-xs sm:text-base leading-[150%] text-center rounded-full px-5 py-1.5">
          {beforeMainText}
        </h1>
      </div>
      <div className="mt-5 bg-transparent z-40">
        <span className="block m-auto text-[28px] sm:text-6xl leading-[120%] font-Gilroy-600 text-center text-white z-50">
          {mainText}
        </span>
      </div>
      <div className=" text-[#ADADAD] text-base font-Inter-300 leading-[188%] sm:leading-[200%] mx-auto max-w-[589px] px-1 mt-4 sm:mt-5 mb-8 md:mb-0">
        {afterMainText}
      </div>
    </div>
  );
};
