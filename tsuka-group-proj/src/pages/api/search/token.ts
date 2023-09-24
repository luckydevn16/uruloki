/** route example: api/search/token?name=tether */

import type { ApiResponse, SearchToken } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { searchTokensByName } from "@/services/search-services";

export default async function tokenSearchHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<SearchToken[]>>
) {
  const { method, query } = req;
  switch (method) {
    case "GET":
      try {
        let name = query.name as string;
        const tokens = await searchTokensByName(name);
        if(tokens.length === 0) {
          res.status(404).json({
            payload: undefined,
            message: `No tokens found for "${name}"`
          })
        } else {
          res
            .status(200)
            .json({ payload: tokens, message: `Successfully found tokens` });
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
