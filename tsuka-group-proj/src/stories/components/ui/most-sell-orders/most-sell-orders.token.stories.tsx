import {
  MostSellOrders as MostSellOrdersComponent
} from "@/components/ui/most-sell-orders/most-sell-orders.token";
import { Meta, StoryObj } from "@storybook/react";
import { IMostSellOrdersTokenProps } from "@/global";

export default {
  title: "Components/UI/MostSellOrders/MostSellOrders",
  component: MostSellOrdersComponent,
  args: {
    tokens: [
      {
        token: {
          id: "bitcoin",
          name: "Bitcoin",
          shortName: "BTC",
          imgUrl: "/tokens/bitcoin.png",
        },
        sellOrders: 125083,
      }, {
        token: {
          id: "polkadot",
          name: "Polkadot",
          shortName: "DOT",
          imgUrl: "/tokens/palkodot.png",
        },
        sellOrders: 40200,
      }, {
        token: {
          id: "anchor protocol",
          name: "Anchor",
          shortName: "ANC",
          imgUrl: "/tokens/anchor.png",
        },
        sellOrders: 15590,
      }, {
        token: {
          id: "ethereum",
          name: "Ethereum",
          shortName: "ETH",
          imgUrl: "/tokens/ethereum.png",
        },
        sellOrders: 3496,
      },
    ],
  },
} as Meta<IMostSellOrdersTokenProps>;

export const MostSellOrders: StoryObj<IMostSellOrdersTokenProps> = {};
