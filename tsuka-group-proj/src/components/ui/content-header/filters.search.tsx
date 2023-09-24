import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import HomePageTokens from "@/lib/api/tokens";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchPair } from "@/types";
export interface FiltersSearchProps {
  // callback: () => void;
}

export type FilterSearchItemType = {
  id: string;
  name: string;
  symbol: string;
  address: string;
};

const FilterSearchItem = ({
  item: { id, token0, token1 },
}: {
  // item: FilterSearchItemType;
  item:SearchPair
}) => {
  const router = useRouter();
  console.log(id);
  return (
    <div
      className="flex items-center [&:not(:last-child)]:border-b-2 [&:not(:last-child)]:border-tsuka-300 py-2 bg-tsuka-500 hover:bg-tsuka-400 cursor-pointer"
      onClick={() => router.push(`/pair/${id}`)}
    >
      <div className="flex flex-col w-[calc(100%-46px)]">
        <div className="text-tsuka-50 text-lg w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {token0.symbol} - {token1.symbol}
        </div>
        <div className="text-tsuka-100 w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {id}
        </div>
      </div>
    </div>
  );
};

export const FiltersSearch: React.FC<FiltersSearchProps> = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<SearchPair[]>([]);
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = ev;
    setSearchQuery(value);
  };
  const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === "Enter") {
      setLoading(true);
      HomePageTokens.searchTokens(searchQuery)
        .then((res) => {
          setItems(res);
          setMessage("");
        })
        .catch((err) => {
          console.log("fetch token by name failed", err);
          setItems([]);
          setMessage("Results could not be loaded at this time");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    const listener = (ev: MouseEvent) => {
      const { target } = ev;
      const thisElement = document.querySelector("#filterToken");
      if (thisElement?.contains(target as Node)) {
        setShowDropDownMenu(true);
        setMessage(
          "Type the name of a coin you want to search and press Enter."
        );
      } else {
        setShowDropDownMenu(false);
      }
    };
    window.addEventListener("click", listener);
    return () => window.removeEventListener("click", listener);
  }, []);
  return (
    <div className="grow md:grow-0 flex flex-col" id="filterToken">
      <div className="flex items-center text-sm text-tsuka-100">
        <FiSearch className="ml-4 -mr-7 z-10 text-tsuka-300" />
        <input
          type="text"
          className=" border border-tsuka-400 w-full md:w-[200px] bg-tsuka-500 rounded-md pl-8 pr-3 py-[8px] focus:outline-0 placeholder-tsuka-300"
          placeholder="Find tokens..."
          name="searchQuery"
          value={searchQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {showDropDownMenu && (
        <div className="relative">
          {loading ? (
            <div className="absolute w-full bg-tsuka-500 py-2 rounded-xl shadow-[0_40px_50px_-15px_rgba(0,0,0,1)]">
              <img
                className="rotate mx-auto"
                src="/icons/loading.png"
                alt="loading"
                width={20}
                height={20}
              />
            </div>
          ) : (
            <div className="absolute top-0 w-[280px] max-h-[300px] overflow-y-scroll bg-tsuka-500 p-5 shadow-[0_40px_50px_-15px_rgba(0,0,0,1)] rounded-xl flex flex-col">
              {items.length ? (
                items.map((item) => (
                  <FilterSearchItem key={item.id} item={item} />
                ))
              ) : (
                <div className="text-tsuka-50">{message}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
