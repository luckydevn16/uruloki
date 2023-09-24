import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import Strategies from "@/pages/strategies";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Pages/Strategies",
  component: Strategies,
  parameters: {
    nextRouter: {
      path: "/strategies",
      asPath: "/strategies",
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
} as Meta;

export const StrategiesPage: StoryObj = {};
