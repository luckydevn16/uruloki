import {
  DefaultButton as ComponentDefaultButton,
  DefaultButtonProps,
} from "@/components/ui/buttons/default.button";
import { Meta, StoryObj } from "@storybook/react";
import { FiPlusCircle } from "react-icons/fi";

export default {
  title: "Components/UI/Buttons/DefaultButton",
  component: ComponentDefaultButton,
  args: {
    label: "Default",
    callback: () => console.log("menu click"),
    filled: true,
    Icon: FiPlusCircle,
  },
} as Meta<DefaultButtonProps>;

export const DefaultButton: StoryObj<DefaultButtonProps> = {};
