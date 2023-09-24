import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import MyOrders from "@/pages/my-orders";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Pages/MyOrders",
  component: MyOrders,
  decorators: [
    (Story) => {
      return <DashboardLayout>{Story()}</DashboardLayout>;
    },
  ],
} as Meta;

export const MyOrdersPage: StoryObj = {};
