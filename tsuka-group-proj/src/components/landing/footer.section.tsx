import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

export interface FooterProps {
  mainText: string;
  afterMainText: string;
}

export const FooterLanding: React.FC<FooterProps> = ({
  mainText,
  afterMainText,
}) => {
  return (
    <div className="inner-container py-[103px] overflow-hidden relative bg-black bg-[20%] sm:bg-[50%] bg-cover bg-no-repeat bg-[url('/footer-background.png')]">
      <div className="px-4 sm:px-28 justify-center text-center relative mt-[103px]">
        <div className="px-0 md:px-14 mt-5 bg-transparent z-40">
          <span className="block m-auto text-3xl font-Gilroy-600 font-semibold text-center mx-auto max-w-[500px] text-white z-50">
            {mainText}
          </span>
        </div>
        <div className=" text-tsuka-100 text-base font-Inter-300 leading-[200%] mx-auto max-w-[500px] mt-4 mb-10 md:mb-0">
          {afterMainText}
        </div>
      </div>
      <div className="text-tsuka-100 mb-4 md:mb-0">
        <div className="sm:flex justify-center mt-10">
          <div className="inline-block w-full sm:max-w-[180px] bg-gradient-to-r from-[#003525] to-[#31C699] rounded-full p-[1px] justify-center items-center mt-3 sm:0">
            <Link href="/homepage">
              <button className="h-full w-full text-white bg-black text-base font-Steradian-400 font-normal text-center rounded-full pl-[21.5px] py-[17.5px] pr-[21.5px] flex justify-center items-center gap-3">
                {"Get Started"}<FaArrowRight />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
