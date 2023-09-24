import { sessionOptions } from "@/lib/session";
import { LoggedInUser, User } from "@/types";
import { withIronSessionApiRoute } from "iron-session/next";

import { NextApiRequest, NextApiResponse } from "next";

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

function logoutRoute(req: NextApiRequest, res: NextApiResponse<LoggedInUser>) {
  req.session.destroy();
  res.json({ isLoggedIn: false, username: "", email: "" });
}