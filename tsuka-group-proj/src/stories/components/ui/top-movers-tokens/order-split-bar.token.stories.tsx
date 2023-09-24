import {
  OrderSplitBar as OrderSplitBarComponent,
  OrderSplitBarProps,
} from "@/components/ui/top-movers-tokens/order-split-bar.token";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/OrderSplitBar/OrderSplitBar",
  component: OrderSplitBarComponent,
  args: {
    buyOrderCount: 2000,
    sellOrderCount: 5000,
  },
} as Meta<OrderSplitBarProps>;

export const OrderSplitBar: StoryObj<OrderSplitBarProps> = {};
