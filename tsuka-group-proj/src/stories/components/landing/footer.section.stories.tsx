import {
  FooterProps,
  FooterLanding as FooterLandingComponent,
} from "@/components/landing/footer.section";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Section/FooterSection",
  component: FooterLandingComponent,
  args:  {
    mainText: "Get Started with Uruloki Today",
    afterMainText: "Sign up now and start automating your crypto trades and taking advantage of arbitrage opportunities."
  },

} as Meta<FooterProps>;

export const FooterSection: StoryObj<FooterProps> = {};
