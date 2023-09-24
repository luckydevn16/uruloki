import {
  FiltersSearch as ComponentFiltersSearch,
  FiltersSearchProps,
} from "@/components/ui/content-header/filters.search";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/ContentHeader/FiltersSearch",
  component: ComponentFiltersSearch,
  args: {
    callback: () => console.log("menu click"),
  },
} as Meta<FiltersSearchProps>;

export const FiltersSearch: StoryObj<FiltersSearchProps> = {};
