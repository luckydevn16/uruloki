import type  { ApiResponse, Notification } from "@/types";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function NotificationByUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Notification>>
) {
  const { query, method } = req;
  const { userid } = query;
  switch (method) {
    case "GET":
      try {
        const user = await prisma.users.findFirst({
          where:{
            user_id: Number(userid)
          }
        })
        if (!user){
        res.status(404).json({payload: undefined, message: `User id ${userid} not found!` });
        break;
      }
        const notifications = await prisma.notifications.findMany({
          where: {
            user_id: Number(userid),
          },
        });
        res.status(200).json({ payload: notifications, message: `Successfully found Notifications` });
      } catch (err) {
        res.status(400).json({ payload: undefined, message: `Something went wrong! Please read the error message '${err}'` });
      }
      break;
    default:
      res.setHeader("Allow", "GET");
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
