import {
  ContentHeader as ContentHeaderComponent,
  ContentHeaderProps,
} from "@/components/ui/content-header/content-header.token";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/ContentHeader/ContentHeader",
  component: ContentHeaderComponent,
  args: {
    title: "Homepage",
  },
} as Meta<ContentHeaderProps>;

export const ContentHeader: StoryObj<ContentHeaderProps> = {};
