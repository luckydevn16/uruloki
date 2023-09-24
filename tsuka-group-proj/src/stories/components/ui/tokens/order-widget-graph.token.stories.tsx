import {
  OrderWidgetGraph,
  OrderWidgetGraphProp,
} from "@/components/ui/tokens/order-widget-graph.token";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Tokens/OrderWidgetGraph",
  component: OrderWidgetGraph,
  args: {
    buy: true,
    value1: 2531,
    bound: {
      min: 153,
      max: 7345,
    },
    showPopupBg: false,
    setShowPopupBg: (a: any) => {},
    setShowEditOrderModal: (a: any) => {},
    setShowDeletedAlert: (a: any) => {},
  },
} as Meta<OrderWidgetGraphProp>;

export const FiltersButton: StoryObj<OrderWidgetGraphProp> = {};
