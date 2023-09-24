import { EditOrDeleteToken as EditOrDelete, EditOrDeleteTokenProp } from "@/components/ui/my-order/edit-or-delete.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/EditOrDelete",
  component: EditOrDelete,
  args: {
    setShowPopupBg: (a: any) => {},
    setShowConfirmDlg: (a: any) => {},
    setShowEditOrderModal: (a: any) => {},
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<EditOrDeleteTokenProp>;

export const FiltersButton: StoryObj<EditOrDeleteTokenProp> = {};
