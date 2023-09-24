// components/ui/buttons/dropdown.tsx
import { getHomePageTokens } from "@/store/apps/tokens";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { TokenIconsToken } from "@/components/ui/tokens/token-icons.token";
import { TokenCache } from "@/types";
import { OrderBookTokens } from "@/components/order-book/order-book.token";

interface OrderBookDropdownProp {
  dropdownOptions: OrderBookTokens[];
  handleSelect: (arg: OrderBookTokens) => void;
}

const OrderBookDropdown: React.FC<OrderBookDropdownProp> = ({
  dropdownOptions,
  handleSelect,
}) => {
  const dispatch = useAppDispatch();
  const { value, status } = useAppSelector((state) => state.homepageTokens);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [selectedOption, setSelectedOption] = useState<OrderBookTokens>(
    dropdownOptions[0]
  );

  useEffect(() => {
    setSelectedOption(dropdownOptions[0]);
  }, [dropdownOptions]);

  useEffect(() => {
    dispatch(getHomePageTokens());
  }, [dispatch]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: OrderBookTokens) => {
    setSelectedOption(option);
    console.log("Selected option:", option);
    handleSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-28">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="w-full px-2 py-2 text-sm font-medium text-white bg-tsuka-400 rounded-md hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 h-8"
        >
          {selectedOption.label}
        </button>
      </div>
      {isOpen && (
        <div className="absolute left-0 w-full mt-2 origin-top-right bg-tsuka-400 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1 ml-2 max-h-36 overflow-y-scroll">
            {dropdownOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="w-full px-4 py-2 text-sm text-white hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderBookDropdown;
