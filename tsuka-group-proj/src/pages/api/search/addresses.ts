/** route example: api/search/token?name=tether */

import type { ApiResponse, SearchToken, SearchPair } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getPairsByTokenAddress, searchTokensByName } from "@/services/search-services";

export default async function tempSearchHandler(
  req: NextApiRequest,
  res: any
) {
  const { method, query } = req;
  switch (method) {
    case "GET":
      try {
        let name = query.name as string;
        const tokens = await searchTokensByName(name);
        console.log("Tokens:")
        console.log(tokens)
        if(tokens.length === 0) {
          res.status(404).json({
            payload: undefined,
            message: `No tokens found for "${name}"`
          })
        } else {
          //console.log("tokens:", tokens);
          const tokenAddress = tokens[0].address;
          // let pairs:SearchPair[] = [];
          // tokens.forEach((pair: SearchToken) => {
          //   pairs = await getPairsByTokenAddress(tokenAddress?.toString());
            
          // });
          let pairsPromises = tokens.map((pair: SearchToken) => getPairsByTokenAddress(pair.address.toString()));
          let pairsArrays: SearchPair[][] = await Promise.all(pairsPromises);
          let pairs: SearchPair[] = pairsArrays.reduce((acc, val) => acc.concat(val), []);
          //console.log("pairs",pairs);
          if(pairs.length===0){
              res.status(404).json({
                  payload: undefined,
                  message: `Something went wrong! pairs not found`,
                });
          }
          res.status(200).json([...pairs]);
        }
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
