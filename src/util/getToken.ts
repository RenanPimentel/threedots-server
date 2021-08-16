import { UserInputError } from "apollo-server";

export function getToken(context: any, throwErr = true): string {
  const authorization = context?.req?.headers?.authorization;

  if (!authorization && throwErr) {
    throw new UserInputError("Authorization header not provided", {
      errors: { general: "Authorization header not provided" },
    });
  }

  const token = authorization.split("Bearer ")[1];

  if (token === "null" && !throwErr) return "";

  if (!token && throwErr) {
    throw new UserInputError("Token not provided", {
      errors: { general: "Token not provided" },
    });
  }

  return token;
}
