import {
  TopMoversTokens as TopMoversTokensComponent
} from "@/components/ui/top-movers-tokens/top-movers-tokens.token";
import { Meta, StoryObj } from "@storybook/react";
import { ITopMoversTokenProps } from "@/global";

export default {
  title: "Components/UI/TopMoversTokens/TopMoversTokens",
  component: TopMoversTokensComponent,
  args: {
    tokens: [
      {
        id: 743,
        token: "SingleEarth",
        chain: {
          name: "BitCoin",
          shortName: "BTC",
          imgUrl: "/tokens/bitcoin.png",
        },
        price: 12503.83,
        risingPercent: 6.95,
        volume: 13859000000000,
        marketCap: 675859000000000,
        orderCount: 3465000000,
        buyOrderCount: 2000,
        sellOrderCount: 150,
      }, {
        id: 456,
        token: "DogeCoins",
        chain: {
          name: "BitCoin",
          shortName: "BTC",
          imgUrl: "/tokens/bitcoin.png",
        },
        price: 12635.45,
        risingPercent: -6.45,
        volume: 13563000000000,
        marketCap: 504634000000000,
        orderCount: 4465000000,
        buyOrderCount: 2000,
        sellOrderCount: 500,
      }, {
        id: 645,
        token: "USDTTether",
        chain: {
          name: "Ethereum",
          shortName: "ETH",
          imgUrl: "/tokens/ethereum.png",
        },
        price: 12474.24,
        risingPercent: 5.53,
        volume: 13536000000000,
        marketCap: 656859000000000,
        orderCount: 3536000000,
        buyOrderCount: 200,
        sellOrderCount: 1500,
      }, {
        id: 563,
        token: "Shiba Inu",
        chain: {
          name: "Ethereum",
          shortName: "ETH",
          imgUrl: "/tokens/ethereum.png",
        },
        price: 12346.43,
        risingPercent: -3.25,
        volume: 13155000000000,
        marketCap: 504245000000000,
        orderCount: 3526000000,
        buyOrderCount: 2000,
        sellOrderCount: 1500,
      }, {
        id: 656,
        token: "SingleEarth",
        chain: {
          name: "BitCoin",
          shortName: "BTC",
          imgUrl: "/tokens/bitcoin.png",
        },
        price: 12345.83,
        risingPercent: 3.35,
        volume: 13452000000000,
        marketCap: 566859000000000,
        orderCount: 3663000000,
        buyOrderCount: 2000,
        sellOrderCount: 0,
      }, {
        id: 729,
        token: "DogeCoins",
        chain: {
          name: "BitCoin",
          shortName: "BTC",
          imgUrl: "/tokens/bitcoin.png",
        },
        price: 12302.63,
        risingPercent: 2.77,
        volume: 12097000000000,
        marketCap: 524689000000000,
        orderCount: 3392000000,
        buyOrderCount: 2000,
        sellOrderCount: 1500,
      },
    ],
  },
} as Meta<ITopMoversTokenProps>;

export const TopMoversTokens: StoryObj<ITopMoversTokenProps> = {};
