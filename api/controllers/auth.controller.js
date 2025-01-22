import { authService } from "../services/auth.service.js";

const createAccount = async (req, res, next) => {
  const { token, user } = await authService.signup(req.body, next);

  res.header("auth-token", token);
  res.status(201).json({
    token,
    user,
  });
};

const loginUser = async (req, res, next) => {
  const { token, user } = await authService.login(req.body, next);

  res.header("auth-token", token);
  res.status(200).json({
    token,
    user,
  });
};

export { createAccount, loginUser };
