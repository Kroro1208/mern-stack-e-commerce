import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class";
import { User } from "../models/user";

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
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
