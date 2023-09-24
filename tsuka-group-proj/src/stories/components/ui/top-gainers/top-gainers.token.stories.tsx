import {
  TopGainers as TopGainersComponent
} from "@/components/ui/top-gainers/top-gainers.token";
import { Meta, StoryObj } from "@storybook/react";
import { ITopGainersTokenProps } from "@/global"

export default {
  title: "Components/UI/TopGainers/TopGainers",
  component: TopGainersComponent,
  args: {
    tokens: [
      {
        token: {
          id: "bitcoin",
          name: "Bitcoin",
          shortName: "BTC",
          imgUrl: "/tokens/bitcoin.png",
        },
        price: 12503.83,
        risingPercent: 3.95,
      }, {
        token: {
          id: "polkadot",
          name: "Polkadot",
          shortName: "DOT",
          imgUrl: "/tokens/palkodot.png",
        },
        price: 39402.77,
        risingPercent: 3.57,
      }, {
        token: {
          id: "anchor protocol",
          name: "Anchor",
          shortName: "ANC",
          imgUrl: "/tokens/anchor.png",
        },
        price: 15590.74,
        risingPercent: 3.21,
      }, {
        token: {
          id: "ethereum",
          name: "Ethereum",
          shortName: "ETH",
          imgUrl: "/tokens/ethereum.png",
        },
        price: 3496.56,
        risingPercent: 3.11,
      },
    ],
  },
} as Meta<ITopGainersTokenProps>;

export const TopGainers: StoryObj<ITopGainersTokenProps> = {};
