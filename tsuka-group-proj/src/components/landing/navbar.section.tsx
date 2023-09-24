import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface NavbarProps {
  icon: {
    url: string;
    title: string;
  };
  titlesCollection: {
    items: NavbarTitleProps[];
  };
}

interface NavbarTitleProps {
  label: string;
  linkTo: string;
}

export const Navbar: React.FC<NavbarProps> = ({ icon, titlesCollection }) => {
  const { items } = titlesCollection;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row w-full lg:justify-between items-center mb-32 z-50">
      <div className="flex justify-between items-center w-full ">
        <div className="flex justify-between items-center">
          <Link href="/" >
            <Image
              // src={icon.url}
              src="/logos/logo_icon.png"
              alt="logo__image"
              width={53}
              height={53}
              style={{ position: "relative" }}
            />
          </Link>
          <div className="px-3 flex flex-col" style={{ position: "relative" }}>
            <span className="text-[26px] tracking-widest font-Uruloki text-white stroke-transparent">URULOKI</span> 
            {/* <span className="font-Uruloki m-0 mt-[9px] tracking-[7px] stroke-transparent">DEJITARU</span> */}
          </div>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white focus:outline-none z-50"
        >
          <svg
            className="h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
          </svg>
        </button>
      </div>
      <div
        className={`lg:flex lg:items-center z-50 ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.linkTo}
            className="text-white text-center font-Inter-400 font-normal lg:ml-8 text-base whitespace-nowrap block lg:inline-block mt-4 lg:mt-0 z-50"
            scroll={false}
          >
            {item.label}
          </Link>
        ))}
        <div className="lg:inline-block bg-gradient-to-r from-[#003525] to-[#31C699] rounded-full p-[1px] justify-center items-center mt-4 lg:mt-0 lg:ml-24 xl:ml-40">
          <Link href={"/homepage"} className="h-full text-white bg-black text-base font-Inter-400 font-normal text-center whitespace-nowrap rounded-full pl-[38px] py-[16px] pr-[38px] flex justify-center items-center gap-3">
            {"Trade now"}
          </Link>
        </div>
      </div>
    </div>
  );
};
