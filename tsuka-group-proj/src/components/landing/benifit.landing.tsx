import Image from "next/image";

export interface BenifitCardProps {
  title: string;
  description: string;
}

export const BenifitCard: React.FC<BenifitCardProps> = ({
  title,
  description,
}) => {
  return (
    <div className={`sm:flex-[30%] bg-white bg-opacity-[0.03] border border-white border-opacity-[0.12] backdrop-blur-[15px] rounded-3xl pl-[32px]  pt-[32px] pr-[20px] pb-[20px] `}>
      <h1 className="text-white text-[17px] font-Gilroy-600 leading-[188%] font-semibold">{title}</h1>
      <h4 className="text-[#ADADAD] mt-2 sm:pr-12 font-Inter-300 text-[15px] leading-7">{description}</h4>
    </div>
  );
};
