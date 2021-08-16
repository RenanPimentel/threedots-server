import { UserInputError } from "apollo-server-errors";
import bcrypt from "bcrypt";
import User from "../../models/User";
import { createToken } from "../../util/createToken";
import { formatArgs } from "../../util/formatArgs";
import { isEmail } from "../../util/isEmail";
import { userAlreadyExists } from "../../util/userAlreadyExists";

const userMutation = {
  async register(_: Obj, registerArgs: Obj) {
    const { args, errors, isValidInput } = formatArgs(registerArgs);

    if (!isValidInput) {
      throw new UserInputError("Register error", { errors });
    }

    const { email, username, password, confirmPassword } = args;
    const lcUsername = username.toLowerCase();

    if (password !== confirmPassword) {
      throw new UserInputError("Password must match", {
        errors: {
          confirmPassword: "Passwords must match",
          password: "Passwords must match",
        },
      });
    }

    if (!isEmail(email)) {
      throw new UserInputError("Email not valid", {
        errors: { email: "Email not valid" },
      });
    }

    const alreadyExists = await userAlreadyExists(lcUsername);
    if (alreadyExists) {
      throw new UserInputError("User already exists", {
        errors: { username: "A user with this username already exists" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      avatar:
        "https://secure.gravatar.com/avatar/53c9e2d89d5c2905733d5f1f79f736f0?s=256&d=mm&r=g",
      email,
      username: lcUsername,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    const token = await createToken(user);

    return { ...user._doc, token };
  },

  async login(_: Obj, loginArgs: Obj) {
    const { args, errors, isValidInput } = formatArgs(loginArgs);

    if (!isValidInput) {
      throw new UserInputError("Login error", { errors });
    }

    const { username, password } = args;
    const user = await User.findOne({ username });

    if (!user) {
      throw new UserInputError("Username not found", {
        errors: { username: "User not found" },
      });
    }

    const isRightPassword = await bcrypt.compare(password, user.password);

    if (!isRightPassword) {
      throw new UserInputError("Wrong password", {
        errors: { password: "Wrong password" },
      });
    }

    const token = await createToken(user);

    return { ...user._doc, token };
  },
};

const userQuery = {
  async user(_: Obj, { username }: Obj) {
    const queriedUser: User = await User.findOne({ username });
    return { ...(queriedUser as any)._doc };
  },
};

export default {
  Mutation: userMutation,
  Query: userQuery,
};
