import {
  IBenifitsItemFields,
  CONTENT_TYPE,
  IBenifitsFields,
} from "@/@types/generated/contentful.types";
import { createClient } from "contentful";
// import { config } from "dotenv";
 
// /*
//  * We tell TypeScript that those environment variables are always defined.
//  * If you want to learn more about this madness, read:
//  * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
//  */
// declare global {
//   namespace NodeJS {
//     interface ProcessEnv {
//       CONTENTFUL_SPACE_ID: string;
//       CONTENTFUL_ACCESS_TOKEN: string;
//       CONTENTFUL_LANDINGPAGE_ID: string;
//     }
//   }
// }

// config();

export default class ContentService {
  static get instance() {
    return new ContentService();
  }

  // client = createClient({
  //   space: process.env.CONTENTFUL_SPACE_ID||"imgksyjxr9j5",
  //   accessToken: process.env.CONTENTFUL_ACCESS_TOKEN||"z6-HPwg_2dKJ8Is5vGFVGLdxScENR7l325JFXVRlBbQ",
  // });
  client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID!,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  });

  async getEntriesByType<T>(type: string) {
    // async getEntriesByType<T extends EntrySkeletonType<FieldsType, string>>(type: string) {
    return (
      await this.client.getEntries<T>({
        content_type: type,
      })
    ).items;
  }
}
