import {
  TokenIconsToken,
  TokenIconsTokenProps,
} from "@/components/ui/tokens/token-icons.token";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Tokens/TokenIconsToken",
  component: TokenIconsToken,
  args: {
    name: "Ethereum",
    shortName: "ETH",
  },
} as Meta<TokenIconsTokenProps>;

export const FiltersButton: StoryObj<TokenIconsTokenProps> = {};
