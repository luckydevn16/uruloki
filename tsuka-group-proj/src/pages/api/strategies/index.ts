import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, Strategy } from "@/types";
import { createSetup } from "@/lib/server/setups";
import { Strategies } from "@/lib/strategies/strategies";

export default async function strategyHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Strategy | any>>
) {
  const { query, method, body } = req;

  switch (method) {
    case "POST":
      try {
        if (!body.name || !body.creatorAddress) {
          res.status(400).json({
            payload: undefined,
            message: `Validation Error: No name or address specified`,
          });
          break;
        }
        await createSetup(body.name, body.creatorAddress);

        res.status(200).json({
          payload: {},
          message: "Successfully created setup",
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    case "GET":
      try {
        const { wallet_address } = query;
        const payload = await Strategies.Server.getStrategiesData(
          wallet_address as string
        );

        res.status(200).json({
          payload,
          message: `Successfully found setups`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;

    case "PATCH":
      try {
        const { id } = body;
        const payload = await Strategies.Server.getStrategyData(id as number);
        console.log("------", payload);

        res.status(200).json({
          payload,
          message: `Successfully found setups`,
        });
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${err}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
