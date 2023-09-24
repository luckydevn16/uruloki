import {
  LiveGraphToken,
} from "@/components/tokens/live-graph.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/LiveGraphToken",
  component: LiveGraphToken,
  args: {
    token: "ETH",
  },
  decorators: [
    (Story: any) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
};

export const FiltersButton = {};
