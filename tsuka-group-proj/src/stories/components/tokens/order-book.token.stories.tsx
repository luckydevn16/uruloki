import { OrderBookToken } from "@/components/order-book/order-book.token";
import { store } from "@/store";
import { Token } from "@/types/token.type";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/OrderBookToken",
  component: OrderBookToken,
  args: {
    token: {
      id: "1",
      token: "ETH",
    },
  },
  decorators: [
    (Story: any) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as unknown as Meta<Token>;

export const FiltersButton: StoryObj<Token> = {};
