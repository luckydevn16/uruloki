import { EditOrderToken as EditOrder, EditOrderTokenProp } from "@/components/ui/my-order/edit-order.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/EditOrder",
  component: EditOrder,
  args: {
    setShowPopupBg: (a: any) => {},
    setShowEditOrderModal: (a: any) => {},
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<EditOrderTokenProp>;

export const FiltersButton: StoryObj<EditOrderTokenProp> = {};
