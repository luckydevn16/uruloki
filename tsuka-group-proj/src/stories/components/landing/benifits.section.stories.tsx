import {
  BenifitsSectionProps,
  BenifitsSection as BenifitsSectionComponent,
} from "@/components/landing/benifits.section";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Section/BenifitsSection",
  component: BenifitsSectionComponent,
  args: {
    beforeMainText: "Benefits of Uruloki",
    mainText: "Experience the Future of Trading",
    afterMainText: "Uruloki offers the following benefits:",
    benefitItemsCollection: {
      items: [
        {
          title: "Save time & effort with automation",
          description:
            "Automate your trading activity with pre-set conditions, saving you time and effort.",
        },
        {
          title: "Reduce risk with pre-set conditions",
          description:
            "Trades based on pre-set conditions, reducing the risk of unfavorable trades.",
        },
        {
          title: "Maximize profits with arbitrage",
          description:
            "Profit more with Uruloki's trading setup by capitalizing on market inefficiencies.",
        },
        {
          title: "Customize your trading setup",
          description:
            "Uruloki's advanced tools and analytics allow you to create a tailored trading setup.",
        },
        {
          title: "Stay updated with real-time monitoring",
          description:
            "Access real-time monitoring with Uruloki's real-time management feature.",
        },
        {
          title: "Increased Efficiency",
          description:
            "With Uruloki's automation and trading setup features, you can execute trades quickly.",
        },
      ],
    },
  },
} as Meta<BenifitsSectionProps>;

export const BenifitsSection: StoryObj<BenifitsSectionProps> = {};
