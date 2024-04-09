import jwt from "jsonwebtoken";
import { env } from "../../utils/env";

export const createToken = (id: number, username: string) => {
  return jwt.sign({ user_id: id, username: username }, env.SECRET_KEY);
};
// eas built preview built
// react native background task

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.SECRET_KEY);
};
