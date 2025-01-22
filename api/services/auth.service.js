import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userDb } from "../db/user.db.js";
import config from "../utils/config.js";
import { errorHandler } from "../helpers/error.js";

export const authService = {
  signup: async (user, next) => {
    try {
      const { email, password } = user;
      if (!email || !password) {
        return next(errorHandler(404, "User not found!"));
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const userByEmail = await userDb.getUserByEmailDb(email);

      if (userByEmail) {
        return next(errorHandler(401, "Email already taken"));
      }

      const newUser = await userDb.createUserDb({
        ...user,
        password: hashedPassword,
      });

      const token = jwt.sign(newUser.id, config.SECRET);

      return {
        token,
        user: user.email,
      };
    } catch (error) {
      next(error);
    }
  },

  login: async (credentials, next) => {
    try {
      const user = await userDb.getUserByEmailDb(credentials.email);

      if (!user) {
        return next(errorHandler(403, "Email or password incorrect"));
      }

      const isCorrectPassword = await bcrypt.compare(
        credentials.password,
        user.password
      );

      if (!isCorrectPassword) {
        return next(errorHandler(403, "Email or password incorrect"));
      }

      const token = jwt.sign(user.id, config.SECRET);

      return {
        token,
        user: user.email,
      };
    } catch (error) {
      next(error);
    }
  },
};
