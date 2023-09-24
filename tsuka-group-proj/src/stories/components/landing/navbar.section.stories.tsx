import {
  NavbarProps,
  Navbar as NavbarComponent,
} from "@/components/landing/navbar.section";

import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Landing/Section/Navbar",
  component: NavbarComponent,
  args: {
    icon:{
      title:"logo",
      url: "https://images.ctfassets.net/imgksyjxr9j5/4kPpSnqplNMxgc8COaYNCE/75e0effd2b17a8fa65173dbc77608751/logo.png",
    },
    titlesCollection:{
      items: [
        {
          label: "Home",
          linkTo: "#home"
        },
        {
          label: "Features",
          linkTo: "#features"
        },
        {
          label: "Benifits",
          linkTo: "#benifits"
        },
        {
          label: "How It Works",
          linkTo: "#howitworks"
        },
      ]
    }
  },
} as Meta<NavbarProps>;

export const Navbar: StoryObj<NavbarProps> = {};
