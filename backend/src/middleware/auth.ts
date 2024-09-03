import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/utility-class";
import { User } from "../models/user";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const requireSignIn = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization as string,
      process.env.JWT_SECRET as string
    );
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ErrorHandler("認証エラー", 401));
  }
};

export const isAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new ErrorHandler("ユーザーが見つかりません", 404));
    }
    if (user.role !== "admin") {
      return next(
        new ErrorHandler("認証エラーです。管理者権限が必要です", 401)
      );
    }
    next(); // ユーザーが管理者の場合、次のミドルウェアに進む
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("サーバーエラーが発生しました", 500));
  }
};
