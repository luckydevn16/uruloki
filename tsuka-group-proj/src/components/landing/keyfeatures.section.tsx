import { KeyFeatureCard } from "./keyfeature.landing";
import Image from "next/image";
import { KeyFeatureCardProps } from "./keyfeature.landing";
import { SectionTitle } from "./sectiontitle.landing";
import { BlurLanding } from "./blur.landing";
import { useState } from "react";

export interface KeyFeaturesSectionProps {
  beforeMainText: string;
  afterMainText: string;
  mainText: string;
  featuresCollection: {
    items: KeyFeatureCardProps[];
  };
}

export const KeyFeaturesSection: React.FC<KeyFeaturesSectionProps> = ({
  beforeMainText,
  afterMainText,
  mainText,
  featuresCollection,
}) => {
  const { items } = featuresCollection;
  const [selectedIndex, setSelectedIndex] = useState(4);
  return (
    <div className="inner-container bg-black py-4 relative pt-40" id="features">
      <BlurLanding
        width={867}
        height={560}
        left={240}
        top={185}
        blurSize={150}
        circles={[
          {
            radius: 519,
            left: 0,
            top: 0,
            color: "#013E2B",
          },
          {
            radius: 354,
            left: 513,
            top: 205,
            color: "#013E2B",
          },
        ]}
      />
      <SectionTitle
        mainText={mainText}
        beforeMainText={beforeMainText}
        afterMainText={afterMainText}
        beforeTextStyle={false}
      />
      <div className="flex flex-col md:flex-row gap-8 mt-24">
        {items.map((item, index) => {
          return (
            <KeyFeatureCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              selected={selectedIndex == index}
              clickHandler={() => {
                setSelectedIndex(index);
              }}
              hoverHandler={()=> {
                setSelectedIndex(index);
              }}
              unhoverHandler={()=>{
                setSelectedIndex(4);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
