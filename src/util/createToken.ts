import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { SECRET } from "../config";

export async function createToken(user: {
  _id: Types.ObjectId;
  email: string;
  username: string;
  password: string;
  avatar: string;
  createdAt: string;
}): Promise<string> {
  const { _id: id, email, password, username, avatar } = user;

  const token = jwt.sign({ id, username, password, email, avatar }, SECRET, {
    expiresIn: "30d",
  });

  return token;
}
