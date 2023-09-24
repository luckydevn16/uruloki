import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import Home from "@/pages/index";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Pages/Home",
  component: Home,
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

export const HomePage: StoryObj = {};
