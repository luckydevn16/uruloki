import {
  HeaderLinkButton as ComponentHeaderLinkButton,
  HeaderLinkButtonProps,
} from "@/components/ui/buttons/header-link.button";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Buttons/HeaderLinkButton",
  component: ComponentHeaderLinkButton,
  args: {
    active: false,
    path: "/header-link",
    title: "Header Link",
  },
} as Meta<HeaderLinkButtonProps>;

export const HeaderLinkButton: StoryObj<HeaderLinkButtonProps> = {};
