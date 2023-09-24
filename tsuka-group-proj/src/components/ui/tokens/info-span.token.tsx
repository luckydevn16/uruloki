export interface InfoSpanTokenProps {
  title: string;
  value: string | number;
  isPositive?: boolean
}

export const InfoSpanToken: React.FC<InfoSpanTokenProps> = ({
  title,
  value,
  isPositive
}) => {
  if(title == "24hr") {
    return (
      <div className={`p-1.5 sm:p-2 flex flex-col items-center justify-end`}>
        <label className="text-tsuka-100 text-xs w-full text-end">{title}</label>
        <label className={`${isPositive ? "text-green-400" : "text-red-400"} text-sm xs:text-base w-full text-end`}>{value}</label>
      </div>
    );
  } else {
    return (
      <div className={`p-1.5 sm:p-2 flex flex-col items-center justify-end`}>
        <label className="text-tsuka-100 text-xs w-full text-end">{title}</label>
        <label className="text-tsuka-50 text-sm xs:text-base w-full text-end">{value}</label>
      </div>
    );
  }
};
