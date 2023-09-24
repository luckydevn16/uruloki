import type {
  ApiResponse,
  TokenCache
} from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function GetAllTokenNameHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenCache>>
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try{
        let allTokenNames:TokenCache[]= []
      try {
          const shortNames = await prisma.token_cache.findMany({ 
              select: {
                short_name: true,
                price: true
              },
              where: {
                short_name: {
                  not: null,
                  notIn: ['-', '?', 'Error in symbol']
                },
              },
            });
          
            allTokenNames = shortNames.map((token) => ({
              shortName: token.short_name as string,
              price: token.price as number
            }));

      } catch (err) {
        allTokenNames=[]
      }
        res
          .status(200)
          .json({ payload: allTokenNames, message: `Successfully found Tokens` });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}