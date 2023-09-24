import type { ApiResponse, TokensInWallet } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { getTokensInWallet } from "@/lib/bitquery/getTokensInWallet";

const reqBodySchema = Joi.object({
  walletAddress: Joi.string().required(),
});

const prisma = new PrismaClient();

export default async function tokensInWalletHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokensInWallet>>
) {
  const { method, query } = req;
  switch (method) {
    case "GET":
      try {
        const { value, error } = reqBodySchema.validate(query);
        if (error) {
          res.status(404).json({
            payload: undefined,
            message: `Validation Error: ${error.message}`,
          });
          break;
        }
        const { walletAddress } = value;
        console.log("walletAddress", walletAddress);
        const tokensInWallet = await getTokensInWallet(walletAddress);
        console.log("tokensInWallet", tokensInWallet);
        if (!tokensInWallet) {
          res.status(404).json({
            payload: {
              tokenBalances: undefined,
              chartData: undefined,
              walletBalances: [],
            },
            message: `Wallet ${walletAddress} not found`,
          });
        } else {
          res.status(200).json({
            payload: {
              tokenBalances: undefined,
              chartData: undefined,
              walletBalances: tokensInWallet,
            },
            message: `Successfully tokens in wallet are fetched at ${walletAddress}`,
          });
        }
        return;
      } catch (err) {
        res.status(400).json({
          payload: undefined,
          message: `Something went wrong! Please read the error message '${JSON.stringify(
            err
          )}'`,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
