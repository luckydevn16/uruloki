import { FiFilter } from "react-icons/fi";

export interface FiltersButtonProps {
  callback: () => void;
}

export const FiltersButton: React.FC<FiltersButtonProps> = ({ callback }) => {
  return (
    <button
      type="button"
      onClick={callback}
      className={`w-full xl:w-52 border border-tsuka-200 text-center md:text-start focus:outline-none rounded-md text-sm px-2 sm:px-5 py-2 inline-flex justify-center md:justify-start items-center mr-2`}
    >
      <label className="mr-1 text-base">
        <FiFilter />
      </label>
      Filters
    </button>
  );
};
