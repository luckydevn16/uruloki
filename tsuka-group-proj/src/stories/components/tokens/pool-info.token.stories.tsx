import {
  PoolInfoToken,
  PoolInfoTokenProps,
} from "@/components/tokens/pool-info.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/PoolInfoToken",
  component: PoolInfoToken,
  args: {
    token: {
      id: "1",
    },
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<PoolInfoTokenProps>;

export const FiltersButton: StoryObj<PoolInfoTokenProps> = {};
