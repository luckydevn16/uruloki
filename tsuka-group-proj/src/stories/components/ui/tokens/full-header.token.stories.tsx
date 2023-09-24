import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import {
  FullHeaderToken,
  FullHeaderTokenProps,
} from "@/components/ui/tokens/full-header.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/UI/Tokens/FullHeaderToken",
  component: FullHeaderToken,
  args: {
    token: {
      id: "1",
      token: "ETH",
    },
  },
  decorators: [
    (Story, context) => {
      return (
        <Provider store={store}>
          <DashboardLayout>{Story()}</DashboardLayout>
        </Provider>
      );
    },
  ],
} as Meta<FullHeaderTokenProps>;

export const FiltersButton: StoryObj<FullHeaderTokenProps> = {};
