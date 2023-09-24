import { FiFilter } from "react-icons/fi";

export interface FiltersButtonProps {
  callback: () => void;
}

export const FiltersButton: React.FC<FiltersButtonProps> = ({ callback }) => {
  return (
    <button
      type="button"
      onClick={callback}
      className={`px-3 py-[11px] focus:outline-none bg-tsuka-500 text-tsuka-100 rounded-md text-sm flex items-center`}
    >
      <label className="mr-1 text-tsuka-200 text-base">
        <FiFilter />
      </label>
      Filters
    </button>
  );
};
