import {
  IBenifitsItemFields,
  ILandingPage, 
  INavbarFields,
} from "@/@types/generated/contentful.types";
import {
  BenifitsSection,
  BenifitsSectionProps,
} from "@/components/landing/benifits.section";
import { CoinTypeLanding } from "@/components/landing/cointype.landing";
import {
  FooterProps,
  FooterLanding,
} from "@/components/landing/footer.section";
import { HeroLanding, HeroProps } from "@/components/landing/hero.section";
import {
  HowItWorksSection,
  HowItWorksSectionProps,
} from "@/components/landing/howitworks.section";
import {
  KeyFeaturesSection,
  KeyFeaturesSectionProps,
} from "@/components/landing/keyfeatures.section";
import { Navbar, NavbarProps } from "@/components/landing/navbar.section";

import { BlurLanding } from "@/components/landing/blur.landing";
import getEntriesLanding from "@/lib/content-graphql";
import { CopyRight } from "@/components/landing/copyright.section";
import ContentService from "@/lib/content-service";


type SsrProps = {
  responsData: {
    response:{

      landingPage:{
  
        hero: HeroProps;
        howItWorks: HowItWorksSectionProps;
        benifits: BenifitsSectionProps;
        keyFeatures: KeyFeaturesSectionProps;
        footer: FooterProps;
        navbar: NavbarProps;
      }
    }
  };
};

const Ssr = ({ responsData }: SsrProps) => {
  console.log("in rendering", responsData);
  const coins =[
    {
      url: '/tokens/ethereum.png',
      name:'Ethereum',
      abbr: 'ETH',
      rate: 5.53,
      price: 12574.24
    },
    {
      url: '/tokens/bitcoin.png',
      name:'Bitcoin',
      abbr: 'BTC',
      rate: 6.95,
      price: 12503.63
    },
    {
      url: '/tokens/anchor.png',
      name:'Anchor',
      abbr: 'ANC',
      rate: 3.21,
      price: 15590.74
    },
    {
      url: '/tokens/polkadot.png',
      name:'Polkadot',
      abbr: 'DOT',
      rate: 5.53,
      price: 12574.24
    },
  ];
  return (
    <div className="landing-container flex flex-col items-center bg-black">
      <HeroLanding {...responsData.response.landingPage.hero} navbar={responsData.response.landingPage.navbar}/>
      <CoinTypeLanding coins={coins}/>
      <KeyFeaturesSection {...responsData.response.landingPage.keyFeatures} />
      <HowItWorksSection {...responsData.response.landingPage.howItWorks} />
      <BenifitsSection {...responsData.response.landingPage.benifits} />
      <FooterLanding {...responsData.response.landingPage.footer} />
      <CopyRight/>
    </div>
  );
};

// export default async function getServerSideProps() {
//   const landingPageContents = (
//     await ContentService.instance.getEntriesByType<ILandingPage>("landingPage")
//   )[0];
//   const landingPage = landingPageContents.fields;

//   getEntriesLanding().then((response) =>
//     console.log("response GraphQL:: ", response)
//   );
//   console.log("Inside ServerSideProps", landingPage);
//   return { props: { landingPage } };
// };
export async function getServerSideProps() {
  const responsData = await getEntriesLanding();

  // console.log(
  //   "responsData::::In getServerSideProps",
  //   JSON.stringify(responsData)
  // );

  return { props: { responsData } };
}

export default Ssr;