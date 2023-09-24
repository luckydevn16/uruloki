import {
  FullHeaderStrategies,
  FullHeaderStrategiesProps,
} from "@/components/ui/strategies/full-header.strategies";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/UI/Strategiess/FullHeaderStrategies",
  component: FullHeaderStrategies,
  args: {
    strategyId: "1",
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<FullHeaderStrategiesProps>;

export const FiltersButton: StoryObj<FullHeaderStrategiesProps> = {};
