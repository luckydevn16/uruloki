import {
  CoinTypeProps,
  CoinTypeLanding as CoinTypeLandingComponent,
} from "@/components/landing/cointype.landing";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Component/CoinTypeLanding",
  component: CoinTypeLandingComponent,
  args: {
    coins:[
      {
        url: '/tokens/ethereum.png',
        name:'Ethereum',
        abbr: 'ETH',
        rate: 5.53,
        price: 12574.24
      },
      {
        url: '/tokens/bitcoin.png',
        name:'Bitcoin',
        abbr: 'BTC',
        rate: 6.95,
        price: 12503.63
      },
      {
        url: '/tokens/anchor.png',
        name:'Anchor',
        abbr: 'ANC',
        rate: 3.21,
        price: 15590.74
      },
      {
        url: '/tokens/polkadot.png',
        name:'Polkadot',
        abbr: 'PKD',
        rate: 5.53,
        price: 12574.24
      },
    ]
  },
} as Meta<CoinTypeProps>;

export const CoinTypeLanding: StoryObj<CoinTypeProps> = {};
