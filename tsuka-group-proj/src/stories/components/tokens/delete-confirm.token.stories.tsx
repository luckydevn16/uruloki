import { DeleteConfirmToken as DeleteConfirm, DeleteConfirmTokenProp } from "@/components/ui/my-order/delete-confirm.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/DeleteConfirm",
  component: DeleteConfirm,
  args: {
    setShowPopupBg: (a: any) => {},
    setShowConfirmDlg: (a: any) => {},
    setShowDeletedAlert: (a: any) => {},
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<DeleteConfirmTokenProp>;

export const FiltersButton: StoryObj<DeleteConfirmTokenProp> = {};
