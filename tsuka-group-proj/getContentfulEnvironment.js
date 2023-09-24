require('dotenv').config();
const contentfulManagement = require('contentful-management');

module.exports = async function () {
  // eslint-disable-next-line deprecation/deprecation
  const contentfulClient = contentfulManagement.createClient({
   accessToken: process.env.CONTENTFUL_CONTENT_MANAGEMENT_TOKEN,
 });

 const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
 const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT);

 return environment;
};
