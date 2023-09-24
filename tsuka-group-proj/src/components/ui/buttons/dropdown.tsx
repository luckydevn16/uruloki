// components/ui/buttons/dropdown.tsx
import { useEffect, useState } from "react";
import { TokenIconsToken } from "@/components/ui/tokens/token-icons.token";
import { TokenCache } from "@/types";

interface DropdownOption {
  allTokenName: TokenCache[];
  setSelectTokenName: Function;
}

const Dropdown: React.FC<DropdownOption> = ({ allTokenName, setSelectTokenName }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [selectedOption, setSelectedOption] = useState<string>(
    allTokenName[0]?.shortName
  );

  const options: TokenCache[] = allTokenName;

  useEffect(() => {
    console.log("hello");
  }, []);

  useEffect(() => {
    setSelectedOption(allTokenName[0]?.shortName);
  }, [allTokenName]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: TokenCache) => {
    setSelectedOption(option.shortName);
    setSelectTokenName(option.shortName);
    console.log("Selected option:", option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-28">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex items-center  w-full px-2  py-2 text-sm font-medium text-white bg-tsuka-400 rounded-md hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 h-8"
        >
          <TokenIconsToken
            name={""}
            shortName={""}
            width={16}
            height={16}
            className="mr-1"
          />
          {selectedOption}
        </button>
      </div>
      {isOpen && (
        <div className="absolute left-0 w-full mt-2 origin-top-right bg-tsuka-400 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1 ml-2 max-h-36 overflow-y-scroll">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="w-full px-4 py-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              >
                {option.shortName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
