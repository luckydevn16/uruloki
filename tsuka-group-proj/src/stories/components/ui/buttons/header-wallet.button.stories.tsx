import {
  HeaderWalletButton as ComponentHeaderWalletButton,
  HeaderWalletButtonProps,
} from "@/components/ui/buttons/header-wallet.button";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Components/UI/Buttons/HeaderWalletButton",
  component: ComponentHeaderWalletButton,
  args: {
    callback: () => console.log("wallet click"),
    wallet: {
      label: "Wallet",
    },
  },
} as Meta<HeaderWalletButtonProps>;

export const HeaderWalletButton: StoryObj<HeaderWalletButtonProps> = {};
