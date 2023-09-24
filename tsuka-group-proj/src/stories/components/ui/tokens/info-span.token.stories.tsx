import {
  InfoSpanToken,
  InfoSpanTokenProps,
} from "@/components/ui/tokens/info-span.token";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Tokens/InfoSpanToken",
  component: InfoSpanToken,
  args: {
    title: "BUY",
    value: "3782",
  },
} as Meta<InfoSpanTokenProps>;

export const FiltersButton: StoryObj<InfoSpanTokenProps> = {};
