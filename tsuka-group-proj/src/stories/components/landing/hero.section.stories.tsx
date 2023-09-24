import {
  HeroProps,
  HeroLanding as HeroLandingComponent,
} from "@/components/landing/hero.section";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Section/HeroSection",
  component: HeroLandingComponent,
  args: {
    title: "All-in-one platform for decentralized asset trading and arbitrage",
    beforeHeroText: "Automate Your Crypto Trades with Uruloki",
    afterHeroText:
      "Our platform allows you to create an order book for decentralized assets, and group multiple orders into a single setup for arbitraging between assets.",
    image: {
      url: "https://images.ctfassets.net/imgksyjxr9j5/4Rg2kkoMiGufVe6zDzlSLA/c74d8f75172217d8445962ed24c2ef70/3_2_screen_mockup.png",
      width: 2106,
      height: 1536,
    },
    navbar: {
      icon: {
        title: "logo",
        url: "https://images.ctfassets.net/imgksyjxr9j5/4kPpSnqplNMxgc8COaYNCE/75e0effd2b17a8fa65173dbc77608751/logo.png",
      },
      titlesCollection: {
        items: [
          {
            label: "Home",
            linkTo: "#home",
          },
          {
            label: "Features",
            linkTo: "#features",
          },
          {
            label: "Benifits",
            linkTo: "#benifits",
          },
          {
            label: "How It Works",
            linkTo: "#howitworks",
          },
        ],
      },
    },
  },
} as Meta<HeroProps>;

export const HeroSection: StoryObj<HeroProps> = {};
