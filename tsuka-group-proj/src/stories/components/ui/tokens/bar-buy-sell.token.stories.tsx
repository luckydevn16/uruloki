import {
  BarBuySellToken,
  BarBuySellTokenProps,
} from "@/components/ui/tokens/bar-buy-sell.token";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Tokens/BarBuySellToken",
  component: BarBuySellToken,
  args: {
    buyValue: 234.94,
    sellValue: 830.94,
  },
} as Meta<BarBuySellTokenProps>;

export const FiltersButton: StoryObj<BarBuySellTokenProps> = {};
