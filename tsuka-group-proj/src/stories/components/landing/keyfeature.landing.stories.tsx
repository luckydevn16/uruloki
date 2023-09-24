import {
  KeyFeatureCardProps,
  KeyFeatureCard as KeyFeatureCardComponent,
} from "@/components/landing/keyfeature.landing";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Component/KeyFeatureCard",
  component: KeyFeatureCardComponent,
  args: {
    title: "Simplify Your Trading with our Order Book",
    description:
      "Keep track of all of your decentralized assets in one place with Uruloki's order book feature.",
    icon: {
      url: "https://images.ctfassets.net/imgksyjxr9j5/5ZQDeNPcGrB90hAKAdVAYr/50ed88b4d85afcb778929debfd907435/Icon.png",
      width: 44,
      height: 40,
    },
  },
} as Meta<KeyFeatureCardProps>;

export const KeyFeatureCard: StoryObj<KeyFeatureCardProps> = {};
