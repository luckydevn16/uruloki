import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { sessionOptions } from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import argon2 from "argon2";
import { LoggedInUser } from '@/types';

const prisma = new PrismaClient();

const reqBodySchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).length(2);

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { body } = req;
  const { value, error } = reqBodySchema.validate(body);
  try {
    if (error) {
      return res.status(404).json({
        payload: undefined,
        message: `Validation Error: ${error.message}`,
      });
    }
    const userexist = await prisma.users.findUnique({
      where: {
        email: value.email,
      },
    });
    if(!userexist){
      return res.status(401).json({
        payload: undefined,
        message: 'Authentication Failed',
      });
    }
    const isValid = await argon2.verify(userexist.password, value.password)
    if(!isValid)
      return res.status(401).json({
        payload: undefined,
        message: 'Authentication Failed',
      });
    const user = {
      isLoggedIn: true,
      username: userexist.username,
      email: userexist.email,
    } as LoggedInUser;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}
