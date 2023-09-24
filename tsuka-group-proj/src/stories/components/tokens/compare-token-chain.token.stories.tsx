import {
  CompareTokenChainToken,
  CompareTokenChainTokenProps,
} from "@/components/tokens/compare-token-chain.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/CompareTokenChainToken",
  component: CompareTokenChainToken,
  args: {
    token: {
      id: "1",
      token: "ETH",
    },
    networks: ["ETH", "BSC", "POLYGON"],
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<CompareTokenChainTokenProps>;

export const FiltersButton: StoryObj<CompareTokenChainTokenProps> = {};
