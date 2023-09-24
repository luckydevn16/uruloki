import {
  HowItWorksSectionProps,
  HowItWorksSection as HowItWorksSectionComponent,
} from "@/components/landing/howitworks.section";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Section/HowItWorksSection",
  component: HowItWorksSectionComponent,
  args: {
    beforeMainText: "How it Works",
    mainText: "Getting Started with Uruloki",
    afterMainText:
      "With Uruloki, trading on decentralized assets and taking advantage of arbitrage opportunities is easy.",
    gettingStartedSectionsCollection: {
      items: [
        {
          description:
            "Sign up for Uruloki and connect your exchange accounts. This will allow you to access and manage your orders in one place",
          descriptionHeader: "Sign up and connect your exchange accounts.",
          features: [
            "Enjoy a seamless experience with Uruloki's intuitive user interface.",
            "Keep your wallet save with Uruloki's top-notch security features.",
          ],
          orientation: false,
          image: {
            title: "Group 33571",
            fileName: "Group 33571.png",
            url: "https://images.ctfassets.net/imgksyjxr9j5/3NeiZT2sBOXH1gZLJofS1X/3511eb94c15322369e9e83c402206b10/Group_33571.png",
            description: "",
            width: 1254,
            height: 2082,
            size: 693159,
          },
        },
        {
          descriptionHeader:
            "Create an order book for the assets you want to trade",
          description:
            "With Uruloki's order book feature, you can easily create and manage the assets you want to trade. Keep track of all your decentralized assets in one place and streamline your workflow.",
          orientation: true,
          features: [
            "Simplify your trading activity with Uruloki's order book feature.",
            "Streamline your workflow and increase your efficiency.",
          ],
          image: {
            url: "https://images.ctfassets.net/imgksyjxr9j5/1cBoRo6oXvpzGqbByRpzwN/82715653e7b7372911d85bb16ec00aea/3_2_screen_mockup.png",
            width: 44,
            height: 40,
          },
        },
        {
          descriptionHeader:
            "Set up a trading setup and select the assets you want",
          description:
            "Create a trading setup with Uruloki by grouping multiple orders on different assets into a single arbitrage setup. Choose the assets you want to include and take advantage of market inefficiencies.",
          orientation: false,
          features: [
            "Create a trading setup that suits your needs with Uruloki's advanced tools.",
            "Customize your setup and make informed decisions with real-time monitoring and management.",
          ],
          image: {
            url: "https://images.ctfassets.net/imgksyjxr9j5/3VljpfEtnBN25ZqKM35W00/2b8544bff0ef66d0a9f7a481e8258ab7/3_2_screen_mockup.png",
            width: 44,
            height: 40,
          },
        },
        {
          descriptionHeader:
            "Monitor and manage your trading activity in real-time",
          description:
            "With Uruloki's real-time monitoring and management, you can stay up-to-date with your trading activity and make informed decisions based on advanced tools and analytics. Customize your trading setup and maximize your profits with ease.",
          orientation: true,
          features: [
            "Stay up-to-date with your trading activity with Uruloki's real-time monitoring and management.",
            "Automate your trades and save time, while maximizing your profits.",
          ],
          image: {
            url: "https://images.ctfassets.net/imgksyjxr9j5/68eKlojTNckgb1ZmfapZiS/acbe6027d44f149bc8bb453f311bd1c7/Group_33568.png",
            width: 44,
            height: 40,
          },
        },
      ],
    },
  },
} as Meta<HowItWorksSectionProps>;

export const HowItWorksSection: StoryObj<HowItWorksSectionProps> = {};
