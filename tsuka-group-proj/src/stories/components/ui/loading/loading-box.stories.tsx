import {
  LoadingBox as ComponentLoadingBox,
  LoadingBoxProps,
} from "@/components/ui/loading/loading-box";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Loading/LoadingBox",
  component: ComponentLoadingBox,
  args: {
    title: "Loading",
    description: "Please wait",
  },
} as Meta<LoadingBoxProps>;

export const LoadingBox: StoryObj<LoadingBoxProps> = {};
