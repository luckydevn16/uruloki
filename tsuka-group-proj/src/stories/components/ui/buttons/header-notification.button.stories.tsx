import {
  HeaderNotificationButton as ComponentHeaderNotificationButton,
  HeaderNotificationButtonProps,
} from "@/components/ui/buttons/header-notification.button";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Buttons/HeaderNotificationButton",
  component: ComponentHeaderNotificationButton,
  args: {
    callback: () => console.log("notification click"),
  },
} as Meta<HeaderNotificationButtonProps>;

export const HeaderNotificationButton: StoryObj<HeaderNotificationButtonProps> =
  {};
