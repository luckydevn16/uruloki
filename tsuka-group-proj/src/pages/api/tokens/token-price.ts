import type { ApiResponse } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import NextCors from "nextjs-cors"
import getTokenPrice from "@/lib/server/tokens/tokenPrice";

const reqBodySchema = Joi.object({
  pair_address: Joi.string().required(),
  yesterday: Joi.boolean().optional(),
})
  .min(1)
  .max(2);

export default async function tokenPriceInPairHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<number>>
) {
  await NextCors(req, res, {
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200
  })
  
  const { method, body } = req;

  switch (method) {
    case "POST":
      try {
        const { value, error } = reqBodySchema.validate(body);
        if (error) {
          res.status(404).json({
            payload: undefined,
            message: `Validation Error: ${error.message}`,
          });
          break;
        }
        const { pair_address, yesterday } = value;

        const result = await getTokenPrice(pair_address, yesterday)

        if(result.success) {
          return res.status(200).json({
            payload: result.price,
            message: "Successfully got price for token"
          })
        } else {
          return res.status(500).json({
            payload: undefined,
            message: result.message ?? "An error occured while processing your request"
          })  
        }
      } catch (err) {
        console.log(err);
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${JSON.stringify(err)}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}