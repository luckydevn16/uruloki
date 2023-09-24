import Image from "next/image";
import { CoinTypeLanding } from "./cointype.landing";
import { SectionTitle, SectionTitleProps } from "./sectiontitle.landing";
import { BlurLanding } from "./blur.landing";
import { Navbar, NavbarProps } from "./navbar.section";
import Link from "next/link"

export interface HeroProps {
  title: string;
  beforeHeroText: string;
  afterHeroText: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  navbar: NavbarProps;
}

export const HeroLanding: React.FC<HeroProps> = ({
  title,
  beforeHeroText,
  afterHeroText,
  image,
  navbar,
}) => {
  return (
    <div className="inner-container bg-black py-4 overflow-hidden relative" id="home">
      <BlurLanding
        width={889}
        height={629}
        left={-401}
        top={-251}
        blurSize={200}
        circles={[
          {
            radius: 629,
            left: 0,
            top: 0,
            color: "#2DB28A",
          },
          {
            radius: 300,
            left: 495,
            top: 166,
            color: "#00261B",
          },
        ]}
      />
      <Navbar {...navbar}></Navbar>
      <SectionTitle
        mainText={title}
        beforeMainText={beforeHeroText}
        afterMainText={afterHeroText}
        beforeTextStyle={true}
      />
      <div className="text-tsuka-100 mb-4 md:mb-0 z-10">
        <div className="flex flex-col sm:flex-row justify-center mt-10 gap-4 pb-10 sm:pb-0">
          <div className="inline-block bg-gradient-to-r from-[#003525] to-[#31C699] rounded-full p-[1px] justify-center items-center">
            <Link href="/homepage">
              <button className="h-full w-full text-white bg-black text-base font-Inter-400 text-center rounded-full pl-[38.5px] py-[17.5px] pr-[38.5px]">
                Get Started
              </button>
            </Link>
          </div>
        </div>
        <div className="relative w-full flex justify-center">
          <div className="absolute w-[200%] top-[10%] sm:top-[15%]"  style={{transform: "skewY(-7deg)"}}>
            <div className="flex w-full h-12 sm:h-16 lg:h-24">
              <div className="flex-1 h-full" style={{
                boxSizing: "border-box",
                borderTop: "1px solid",
                borderTopColor:
                "linear-gradient(270deg, #31C699 -3.19%, #003525 95.62%)",
                transform: "translateY(80%)",
              }}></div>
              <div className="flex-1 h-full" style={{
                background:
                  "linear-gradient(270deg, #31C699 -3.19%, #003525 95.62%)",
              }}></div>
            </div>
            <div className="flex w-full h-12 sm:h-16 lg:h-24">
              <div className="flex-1 h-full" style={{
                background:
                "linear-gradient(270deg, #31C699 -3.19%, #003525 95.62%)",
                transform: "translateY(80%)",
              }}></div>
              <div className="flex-1 h-full" style={{
                boxSizing: "border-box",
                borderBottom: "1px solid",
                borderBottomColor:
                  "linear-gradient(270deg, #31C699 -3.19%, #003525 95.62%)",
              }}></div>
            </div>

          </div>
          <Image
            src={image.url}
            alt="hero_image"
            width={1024}
            height={1}
            style={{ position: "relative" }}
            priority={true}
          />
        </div>
      </div>
    </div>
  );
};
