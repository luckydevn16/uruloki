import {
  HorizontalIconsToken,
  HorizontalIconsTokenProps,
} from "@/components/ui/tokens/horizontal-icons.token";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Tokens/HorizontalIconsToken",
  component: HorizontalIconsToken,
  args: {
    inputToken: {
      name: "Ethereum",
      code: "ETH",
    },
    outputToken: {
      name: "Bitcoin",
      code: "BTC",
    },
  },
} as Meta<HorizontalIconsTokenProps>;

export const FiltersButton: StoryObj<HorizontalIconsTokenProps> = {};
