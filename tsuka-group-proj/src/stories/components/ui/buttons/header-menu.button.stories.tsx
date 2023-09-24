import {
  HeaderMenuButton as ComponentHeaderMenuButton,
  HeaderMenuButtonProps,
} from "@/components/ui/buttons/header-menu.button";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Buttons/HeaderMenuButton",
  component: ComponentHeaderMenuButton,
  args: {
    callback: () => console.log("menu click"),
  },
} as Meta<HeaderMenuButtonProps>;

export const HeaderMenuButton: StoryObj<HeaderMenuButtonProps> = {};
