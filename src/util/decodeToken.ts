import { UserInputError } from "apollo-server";
import jwt from "jsonwebtoken";

export function decodeToken(token: string): UserToken {
  try {
    const decodedToken = jwt.decode(token);

    if (!decodedToken) {
      throw new UserInputError("Invalid token", {
        errors: { general: "Invalid token" },
      });
    }

    const { exp } = decodedToken as { exp: number };
    const isExpired = new Date(exp * 1000) < new Date();

    if (isExpired) {
      throw new UserInputError("Expired token", {
        errors: { general: "Expired token" },
      });
    }

    return decodedToken as UserToken;
  } catch (err) {
    throw new UserInputError("Invalid token", {
      errors: { general: "Invalid token" },
    });
  }
}
