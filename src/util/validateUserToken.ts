import { UserInputError } from "apollo-server";
import User from "../models/User";

export async function validateUserToken(token: UserToken): Promise<void> {
  const user = await User.findById(token.id);

  if (
    !user ||
    token.password !== user.password ||
    token.username !== user.username
  ) {
    throw new UserInputError("Invalid token", {
      errors: { general: "Invalid token" },
    });
  }
}
