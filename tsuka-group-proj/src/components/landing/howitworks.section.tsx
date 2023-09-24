import {
  GettingStartedItemProps,
  GettingStartedItem,
} from "./getttingstarted.landing";
import { SectionTitle } from "./sectiontitle.landing";

export interface HowItWorksSectionProps {
  beforeMainText: string;
  afterMainText: string;
  mainText: string;
  gettingStartedSectionsCollection: {
    items: GettingStartedItemProps[];
  };
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  beforeMainText,
  afterMainText,
  mainText,
  gettingStartedSectionsCollection,
}) => {
  const { items } = gettingStartedSectionsCollection;
  return (
    <div className="bg-black py-4 overflow-hidden pt-56" id="howitworks">
      <SectionTitle
        mainText={mainText}
        beforeMainText={beforeMainText}
        afterMainText={afterMainText}
        beforeTextStyle={false}
      />
      <div className="flex flex-col mt-24">
        {items.map((item, index) => {
          return (
            <GettingStartedItem
              key={item.descriptionHeader}
              descriptionHeader={item.descriptionHeader}
              description={item.description}
              image={item.image}
              features={item.features}
              orientation={item.orientation}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};
