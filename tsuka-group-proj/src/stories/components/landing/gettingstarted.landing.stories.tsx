import {
  GettingStartedItemProps,
  GettingStartedItem as GettingStartedItemComponent,
} from "@/components/landing/getttingstarted.landing";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Component",
  component: GettingStartedItemComponent,
  args: {
    description:
      "Sign up for Uruloki and connect your exchange accounts. This will allow you to access and manage your orders in one place",
    descriptionHeader: "Sign up and connect your exchange accounts.",
    features: [
      "Enjoy a seamless experience with Uruloki's intuitive user interface.",
      "Keep your wallet save with Uruloki's top-notch security features.",
    ],
    origin: false,
    image: {
      title: "Group 33571",
      fileName: "Group 33571.png",
      url: "https://images.ctfassets.net/imgksyjxr9j5/3NeiZT2sBOXH1gZLJofS1X/3511eb94c15322369e9e83c402206b10/Group_33571.png",
      description: "",
      width: 1254,
      height: 2082,
      size: 693159,
    },
    index: 0,
  },
} as Meta<GettingStartedItemProps>;

export const GettingStartedItem: StoryObj<GettingStartedItemProps> = {};
