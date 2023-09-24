import React, { InputHTMLAttributes, useEffect, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  currentAmount: string;
  maxAmount: string;
  currentShortName: string;
}

export const TokenMovementInput: React.FC<Props> = ({
  currentAmount = 0,
  maxAmount = 0,
  currentShortName,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState(currentAmount);

  const handleInputChange = (event: any) => {
    const input = event.target.value;

    const sanitizedInput = input; //.replace(/[^0-9.]/g, "");

    setInputValue(sanitizedInput || 0);
  };

  useEffect(() => {
    setInputValue(currentAmount);
  }, [currentAmount]);

  return (
    <div className="flex items-center gap-3 relative w-full bg-tsuka-500 outline-none border border-tsuka-400 rounded-md  px-[19px] py-[11px] mb-[9px]">
      <span className="text-[#676F84] whitespace-nowrap font-Poppins-300 font-normal text-[14px] leading-[21px]">
        Amount :
      </span>
      <input
        className="appearance-none text-start block w-full text-sm bg-inherit text-tsuka-50 p-2 leading-tight focus:outline-none focus:text-white"
        value={inputValue}
        onChange={handleInputChange}
        {...rest}
      />
      <span className="text-[BBC3D7] font-Poppins-300 font-normal text-[14px] leading-[21px] ">
        {currentShortName}
      </span>{" "}
      <span
        onClick={() => setInputValue(maxAmount)}
        className="text-[#E88326] cursor-pointer font-Poppins-300 font-medium text-[12px] leading-[18px]"
      >
        MAX
      </span>
    </div>
  );
};
