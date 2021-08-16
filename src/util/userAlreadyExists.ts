import User from "../models/User";

export async function userAlreadyExists(username: string): Promise<boolean> {
  const user = await User.findOne({ username: username.toLowerCase() });
  return Boolean(user);
}
