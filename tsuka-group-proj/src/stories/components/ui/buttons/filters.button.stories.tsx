import {
  FiltersButton as ComponentFiltersButton,
  FiltersButtonProps,
} from "@/components/ui/buttons/filters.button";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Buttons/FiltersButton",
  component: ComponentFiltersButton,
  args: {
    callback: () => console.log("menu click"),
  },
} as Meta<FiltersButtonProps>;

export const FiltersButton: StoryObj<FiltersButtonProps> = {};
