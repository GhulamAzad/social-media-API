import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const getLoginUser = async (req, res, next) => {
  try {
    if (!req.userId) throw new Error("Unauthenticated");
    const {
      _id: user_id,
      name,
      email,
      createdAt,
    } = await User.findById(req.userId);
    res.status(200).json({
      user_id,
      name,
      email,
      createdAt,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "invalid credentials." });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "16h" }
    );
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exist." });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "16h" }
    );
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};
