import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import Strategies from "@/pages/strategies/[id]";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Pages/Strategies/ID",
  component: Strategies,
  parameters: {
    nextRouter: {
      path: "/strategies/[id]",
      asPath: "/strategies/1",
      query: {
        id: "1",
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

export const StrategiesPage: StoryObj = {};
