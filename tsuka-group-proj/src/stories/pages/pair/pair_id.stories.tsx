import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import Pair from "@/pages/pair/[pair_id]";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Pages/Pair/ID",
  component: Pair,
  parameters: {
    nextRouter: {
      path: "/pair/[pair_id]",
      asPath: "/pair/1",
      query: {
        pair_id: "1",
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Provider store={store}>
          <DashboardLayout>{Story()}</DashboardLayout>
        </Provider>
      );
    },
  ],
  args: {
    id: "1",
  },
} as Meta;

export const PairPage: StoryObj = {};
