import { DashboardLayout } from "@/components/layouts/dashboard.layout";
import Settings from "@/pages/settings";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Pages/Settings",
  component: Settings,
  decorators: [
    (Story) => {
      return <DashboardLayout>{Story()}</DashboardLayout>;
    },
  ],
} as Meta;

export const SettingsPage: StoryObj = {};
