import { FiltersSearch } from "@/components/ui/content-header/filters.search";
import { FiltersButton } from "@/components/ui/content-header/filters.button";

export interface ContentHeaderProps {
  title: string;
  className?: string;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({ title, className }) => {

  return (
    <div className={`flex justify-between items-center${className ? " ":""}${className}`}>
      <h1 className="hidden md:block text-[40px] leading-[52px] font-medium text-tsuka-50">{title}</h1>
      <div className="flex w-full md:w-auto items-center gap-3">
        <FiltersSearch />
        <FiltersButton callback={() => console.log("filter button clicked!")} />
      </div>
    </div>
  );
};
