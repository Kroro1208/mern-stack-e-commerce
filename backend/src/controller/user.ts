import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const saltRounds = 10;

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone) {
      throw new ErrorHandler("全ての入力を行ってください", 400);
    }
    if (!password || password.length < 6) {
      throw new ErrorHandler("パスワードは6桁以上で入力してください", 400);
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ErrorHandler("このメールアドレスは既に使用されています", 400);
    }
    const hashedPassword = await hashPassword(password);
    const user = await new User({
      name,
      email,
      phone,
      password: hashedPassword,
    }).save();
    res.status(201).json({
      message: "ユーザーが作成されました",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new ErrorHandler("メールアドレスは必須項目です", 400);
    }
    if (!password) {
      throw new ErrorHandler("パスワードは必須項目です", 400);
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorHandler("ユーザーが存在しません", 404);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ErrorHandler("パスワードが一致しません", 401);
    }
    if (!process.env.JWT_SECRET) {
      throw new ErrorHandler("サーバー設定エラー", 500);
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "ログイン成功",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
