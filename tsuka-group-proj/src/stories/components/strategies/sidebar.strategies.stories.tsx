import { strategiesData } from "@/@fake-data/strategies.fake-data";
import {
  SidebarStrategies,
  SidebarStrategiesProps,
} from "@/components/strategies/sidebar.strategies";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Strategies/SidebarStrategies",
  component: SidebarStrategies,
  args: {
    open: true,
    handleOpen: () => console.log("close"),
    strategy: strategiesData[0],
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<SidebarStrategiesProps>;

export const FiltersButton: StoryObj<SidebarStrategiesProps> = {};
