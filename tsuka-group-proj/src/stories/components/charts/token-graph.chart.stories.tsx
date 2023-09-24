import {
  TokenGraphChart,
} from "@/components/charts/token-graph.chart";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";
import { Provider } from "react-redux";

export default {
  title: "Components/Charts/TokenGraphChart",
  component: TokenGraphChart,
  args: {
    token: "ETH",
  },
  decorators: [
    (Story: () => string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal | null | undefined) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
};

export const FiltersButton = {};
