import {
  SectionTitleProps,
  SectionTitle as SectionTitleComponent,
} from "@/components/landing/sectiontitle.landing";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Component/SectionTitle",
  component: SectionTitleComponent,
  args: {
    mainText:
      "All-in-one platform for decentralized asset trading and arbitrage",
    beforeMainText: "Automate Your Crypto Trades with Uruloki",
    afterMainText:
      "Our platform allows you to create an order book for decentralized assets, and group multiple orders into a single setup for arbitraging between assets.",
    beforeTextStyle: false,
  },
} as Meta<SectionTitleProps>;

export const SectionTitle: StoryObj<SectionTitleProps> = {};
