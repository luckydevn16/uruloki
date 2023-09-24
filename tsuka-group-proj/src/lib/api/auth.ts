import { LoggedInUser, LoginUserData } from "@/types";
import { httpRequest } from "./http";

export default class Auth {
  static login = async (data: LoginUserData):Promise<LoggedInUser> => {
    return await httpRequest.post("/auth/login", data)
  };

  static logout = async (): Promise<LoggedInUser> => {
    return await httpRequest.get("/auth/logout");
  };
}
