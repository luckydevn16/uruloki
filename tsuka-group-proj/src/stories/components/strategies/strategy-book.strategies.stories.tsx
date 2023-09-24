import { strategiesData } from "@/@fake-data/strategies.fake-data";
import {
  StrategiesPageComponent,
  StrategiesPageComponentProps,
} from "@/components/strategies/strategy-page-component";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Strategies/StrategyBookStrategies",
  component: StrategiesPageComponent,
  args: {
    strategies: strategiesData,
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<StrategiesPageComponentProps>;

export const FiltersButton: StoryObj<StrategiesPageComponentProps> = {};
