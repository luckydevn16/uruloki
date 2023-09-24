import Image from "next/image";

export interface KeyFeatureCardProps {
  title: string;
  description: string;
  icon: {
    url: string;
    width: number;
    height: number;
  };
  selected: boolean;
  clickHandler: () => void;
  hoverHandler: () => void;
  unhoverHandler: () => void;
}

export const KeyFeatureCard: React.FC<KeyFeatureCardProps> = ({
  title,
  description,
  icon,
  selected = false,
  clickHandler = () => console.log("dfdf"),
  hoverHandler,
  unhoverHandler,
}) => {
  let selectedIconClass = selected
    ? "bg-gradient-to-br from-teal-500 to-green-900"
    : "bg-white bg-opacity-5";
  return (
    <div
      className={`w-full bg-white bg-opacity-[0.03] border border-white border-opacity-[0.12] backdrop-blur-[15px] rounded-3xl px-5 py-5 pb-6 sm:pl-[38px] sm:pr-[24px] sm:pt-[51px] sm:pb-[42px] cursor-pointer`}
      onClick={clickHandler}
      onMouseEnter={hoverHandler}
      onMouseLeave={unhoverHandler}
      style={{
        transition: "all 0.2s ease-in-out",
        transform: selected ? "scale(1.03)" : "scale(1)",
      }}
    >
      <div
        className={`w-[56px] h-[57px] ${selectedIconClass} backdrop-blur-[10px] flex justify-center items-center rounded-xl`}
      >
        <Image src={icon.url} alt="keyfeature__image" width={20} height={18} />
      </div>
      <h1 className="text-white text-xl font-Gilroy-600 leading-8 font-semibold mt-7 pr-6 sm:pr-12">
        {title}
      </h1>
      <h4 className="text-[#ADADAD] font-Inter-300 mt-2 pr-6 sm:pr-12 text-[15px] leading-7">
        {description}
      </h4>
    </div>
  );
};
