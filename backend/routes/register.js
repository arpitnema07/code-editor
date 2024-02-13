import express from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import User from "../models/user.js";
import UserRes from "../models/user_res.js";
import ErrorRes from "../models/error_res.js";

const register = express.Router();

register.post("/", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(new ErrorRes("Validation errors", errors.array()));
  }

  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(new ErrorRes("User exists with the given Email, please log in."));
    }

    const saltRounds = 10; // Number of bcrypt salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      username,
      hashPass: hashedPassword,
      imageUrl: "0",
      loggedIn: false, // New users start as not logged in
    });

    const savedUser = await newUser.save();

    return res.json({
      message: "User created successfully",
      response: new UserRes(savedUser),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ErrorRes("Something went wrong."));
  }
});

export default register;
