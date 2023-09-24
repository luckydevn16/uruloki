import { DeletedAlertToken as DeletedAlert, DeletedAlertTokenProp } from "@/components/ui/my-order/deleted-alert.token";
import { store } from "@/store";
import { Meta, StoryObj } from "@storybook/react";
import { Provider } from "react-redux";

export default {
  title: "Components/Tokens/DeletedAlert",
  component: DeletedAlert,
  args: {
    setShowPopupBg: (a: any) => {},
    setShowDeletedAlert: (a: any) => {},
  },
  decorators: [
    (Story) => {
      return <Provider store={store}>{Story()}</Provider>;
    },
  ],
} as Meta<DeletedAlertTokenProp>;

export const FiltersButton: StoryObj<DeletedAlertTokenProp> = {};
