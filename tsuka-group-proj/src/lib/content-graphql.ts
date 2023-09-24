import { GraphQLClient, gql } from "graphql-request";
const endpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;

const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
  },
});
export default async function getEntriesLanding() {
  const query = gql`
    query LandingPageContent {
      landingPage(id: "${process.env.CONTENTFUL_LANDINGPAGE_ID}") {
        navbar {
          icon {
            title
            url
          }
          titlesCollection{
            items{
              label
              linkTo
            }
          }
        }
        hero {
          beforeHeroText
          title
          afterHeroText
          image {
            url
            width
            height
          }
        }
        keyFeatures {
          beforeMainText
          mainText
          afterMainText
          featuresCollection {
            items {
              title
              description
              icon {
                url
                width
                height
              }
            }
          }
        }
        howItWorks {
          beforeMainText
          mainText
          afterMainText
          gettingStartedSectionsCollection {
            items {
              descriptionHeader
              description
              features
              orientation
              image {
                description
                url
              }
            }
          }
        }
        benifits {
          beforeMainText
          mainText
          afterMainText
          benefitItemsCollection {
            items {
              title
              description
            }
          }
        }
        footer {
          mainText
          afterMainText
        }
      }
    }
  `;
  const response = await client.request(query);

  return { response };
}

// temp
async function getHowItworks() {
  const query = gql`
    query HowItworksContent {
      gettingStartedItemCollection {
        items {
          description
          descriptionHeader
          features
          orientation
          image {
            title
            fileName
            url
            description
            width
            height
            size
          }
        }
      }
    }
  `;

  const howItWorks = await client.request(query);

  return { howItWorks };
}
