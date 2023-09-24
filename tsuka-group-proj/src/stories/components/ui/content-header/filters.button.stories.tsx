import {
  FiltersButton as ComponentFiltersButton,
  FiltersButtonProps,
} from "@/components/ui/content-header/filters.button";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/ContentHeader/FiltersButton",
  component: ComponentFiltersButton,
  args: {
    callback: () => console.log("menu click"),
  },
} as Meta<FiltersButtonProps>;

export const FiltersButton: StoryObj<FiltersButtonProps> = {};
