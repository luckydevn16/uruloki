import type  { ApiResponse, User } from "@/types";
import {  PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import argon2 from "argon2";
import Joi from "joi";

const prisma = new PrismaClient();


const reqBodySchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).error(new Error('Password must have at least 8 characters without special character')).required(),
  }).length(3);


export default async function UsersHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User>>
) {
  const { method, body } = req;
  switch (method) {
    case "POST":
      try {
        const {value,error} = reqBodySchema.validate(body);
        if (error) {
          res.status(404).json({
              payload: undefined,
              message: `Validation Error: ${error.message}`,
            });
          break;
        }
        const user = await prisma.users.create({
          data:{
            username:value.username,
            email:value.email,
            password:await argon2.hash(value.password)
          },
          select:{
            user_id:true,
            email:true,
            username:true,
          }
        });
        res
          .status(200)
          .json({ payload: user, message: `Successfully created user` });
      } catch (err) {
        res
          .status(400)
          .json({
            payload: undefined,
            message: `Something went wrong! Please read the error message '${err}'`,
          });
      }
      break;
    case "GET":
      try {
        const users = await prisma.users.findMany({
          select:{
            user_id:true,
            email:true,
            username:true,
          }
        });
        res
          .status(200)
          .json({ payload: users, message: `Successfully found users` });
      } catch (err) {
        res
          .status(400)
          .json({
            payload: undefined,
            message: `Something went wrong! Please read the error message '${err}'`,
          });
      }
      break;
    default:
      res.setHeader("Allow", ["POST","GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
