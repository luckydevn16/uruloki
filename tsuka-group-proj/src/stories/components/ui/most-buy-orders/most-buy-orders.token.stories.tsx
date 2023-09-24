import {
  MostBuyOrders as MostBuyOrdersComponent
} from "@/components/ui/most-buy-orders/most-buy-orders.token";
import { Meta, StoryObj } from "@storybook/react";
import { IMostBuyOrdersTokenProps } from "@/global";

export default {
  title: "Components/UI/MostBuyOrders/MostBuyOrders",
  component: MostBuyOrdersComponent,
  args: {
    tokens: [
      {
        token: {
          id: "bitcoin",
          name: "Bitcoin",
          shortName: "BTC",
          imgUrl: "/tokens/bitcoin.png",
        },
        buyOrders: 100800,
      }, {
        token: {
          id: "polkadot",
          name: "Polkadot",
          shortName: "DOT",
          imgUrl: "/tokens/palkodot.png",
        },
        buyOrders: 39000,
      }, {
        token: {
          id: "anchor protocol",
          name: "Anchor",
          shortName: "ANC",
          imgUrl: "/tokens/anchor.png",
        },
        buyOrders: 15230,
      }, {
        token: {
          id: "ethereum",
          name: "Ethereum",
          shortName: "ETH",
          imgUrl: "/tokens/ethereum.png",
        },
        buyOrders: 3800,
      },
    ],
  },
} as Meta<IMostBuyOrdersTokenProps>;

export const MostBuyOrders: StoryObj<IMostBuyOrdersTokenProps> = {};
