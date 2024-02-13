import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/user.js";
import UserRes from "../models/user_res.js";
import ErrorRes from "../models/error_res.js";
import { JWT_SECRET } from "../utils/constants.js";

const login = express.Router();

login.post("/", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ErrorRes("Validation errors", errors.array()));
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(new ErrorRes("User does not exist, Create a new account."));
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashPass);
    if (isPasswordValid) {
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      await User.findOneAndUpdate(
        { email: user.email },
        { $set: { token, loggedIn: true } },
        { new: true }
      );

      return res.json({
        message: "User Logged in Successfully",
        response: new UserRes(user),
        token: token,
      });
    } else {
      return res
        .status(401)
        .json(new ErrorRes("Authentication failed, Wrong password."));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ErrorRes("Something went wrong."));
  }
});

export default login;
