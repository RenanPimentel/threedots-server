import { UserInputError } from "apollo-server";

export function handleExpiredToken(userToken: { exp: number }): void {
  const isExpired = new Date(userToken.exp * 1000) < new Date();

  if (isExpired) {
    throw new UserInputError("Expired token", {
      errors: { general: "Expired token" },
    });
  }
}
