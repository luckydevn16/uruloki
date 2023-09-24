import { Cache } from "@/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class DataCache {
  /**
   * Reads the cached data for "data_key" from the cache if it is not stale
   * @param data_key 
   * @returns 
   */
  static getIfFresh = async (data_key: string): Promise<Cache> => {
    let result = await prisma.cache.findFirst({ where: { data_key } })
    if(result) {
      let deadline = result!.timestamp + result!.ttl
      let currentTime = Math.floor(Date.now() / 1000)

      if (deadline >= currentTime) {
        return {
          stale: false,
          data: {
            data_key: result?.data_key as string,
            cached_data: JSON.parse(result?.cached_data as string)
          }
        }
      } else {
        return {
          stale: true,
          data: {
            data_key: '',
            cached_data: {}
          }
        }
      }
    } else {
      return {
        stale: true,
        data: {
          data_key: '',
          cached_data: {}
        }
      }
    }
  };

  /**
   * Adds the supplied data to the cache, overwriting any other item in the cache with the same key
   * @param data 
   * @param key 
   * @param ttl (seconds)
   */
  static addToCache = async (data: any, key: string, ttl: number) => {
    let currentTime = Math.floor(Date.now() / 1000)
    await prisma.cache.deleteMany({ where: { data_key: key } })
    await prisma.cache.create({
      data: {
        timestamp: currentTime,
        cached_data: JSON.stringify(data),
        data_key: key,
        ttl: ttl
      }
    })
  }
}
