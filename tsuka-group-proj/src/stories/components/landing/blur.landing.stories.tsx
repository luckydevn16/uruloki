import {
  BlurProps,
  BlurCircleProps,
  BlurLanding as BlurLandingComponent,
} from "@/components/landing/blur.landing";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Component/BlurLanding",
  component: BlurLandingComponent,
  args: {
    width: 889,
    height: 629,
    top: -251,
    left: -401,
    radius: 300,
    blurSize: 200,
    circles: [
      {
        radius: 629,
        left:0,
        top:0,
        color: "#2DB38A"
      },
      {
        radius: 393,
        left:496,
        top:166,
        color: "#004B35"
      }
    ]
  },
} as Meta<BlurProps>;

export const BlurLanding: StoryObj<BlurProps> = {};
