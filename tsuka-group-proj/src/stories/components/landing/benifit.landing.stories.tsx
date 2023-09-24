import {
  BenifitCardProps,
  BenifitCard as BenifitCardComponent,
} from "@/components/landing/benifit.landing";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Component/BenifitCard",
  component: BenifitCardComponent,
  args: {
    title: "Save time & effort with automation",
    description:
      "Automate your trading activity with pre-set conditions, saving you time and effort.",
  },
} as Meta<BenifitCardProps>;

export const BenifitCard: StoryObj<BenifitCardProps> = {};
