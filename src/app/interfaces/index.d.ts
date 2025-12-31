import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../Modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}
