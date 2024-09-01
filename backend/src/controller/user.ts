import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class";
import { User } from "../models/user";
import bcrypt from "bcryptjs";

const saltRounds = 10;

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone) {
      return next(new ErrorHandler("全ての入力を行ってください", 400));
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "パスワードは6桁以上で入力してください" });
    }
    const exsistingUser = await User.findOne({ email });
    if (exsistingUser) {
      res.status(400).json({ error: "Email is taken" });
    }
    const hashedPassword = await hashPassword(password);
    const user = await new User({
      name,
      email,
      phone,
      password: hashedPassword,
    }).save();
    res.json({
      message: "ユーザーが作成されました",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
