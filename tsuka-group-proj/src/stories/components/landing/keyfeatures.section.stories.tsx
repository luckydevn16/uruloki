import {
  KeyFeaturesSectionProps,
  KeyFeaturesSection as KeyFeaturesSectionComponent,
} from "@/components/landing/keyfeatures.section";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Section/KeyFeaturesSection",
  component: KeyFeaturesSectionComponent,
  args: {
    beforeMainText: "Key Features",
    mainText: "With Uruloki, You can",
    afterMainText:
      "Discover the key features of Uruloki, the all-in-one platform for decentralized asset trading",
    featuresCollection: {
      items: [
        {
          title: "Simplify Your Trading with our Order Book",
          description:
            "Keep track of all of your decentralized assets in one place with Uruloki's order book feature.",
          icon: {
            url: "https://images.ctfassets.net/imgksyjxr9j5/5ZQDeNPcGrB90hAKAdVAYr/50ed88b4d85afcb778929debfd907435/Icon.png",
            width: 44,
            height: 40,
          },
        },
        {
          title: "Take Advantage of Arbitrage Oppourtunities",
          description:
            "Group multiple orders on different assets into a single setup and take advantage of market inefficiencies.",
          icon: {
            url: "https://images.ctfassets.net/imgksyjxr9j5/38MMDvsdyj0wktyScMWRiO/2c2ef14dcdfac5e5483ff65ea71e40fb/Icon.png",
            width: 42,
            height: 40,
          },
        },
        {
          title: "Save Time with Uruloki's Automated Trading",
          description:
            "Automate your trades with Uruloki's featurke to execute trades automatically based on pre-set conditions.",
          icon: {
            url: "https://images.ctfassets.net/imgksyjxr9j5/73W1d36WDn9S2uNTTnHbX9/1b9d7207324a923fca912114890a74a9/Icon.png",
            width: 44,
            height: 44,
          },
        },
      ],
    },
  },
} as Meta<KeyFeaturesSectionProps>;

export const KeyFeaturesSection: StoryObj<KeyFeaturesSectionProps> = {};
