import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TryCatch } from "../middleware/error";

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

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
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

export const getAllUsers = TryCatch(async (req: Request, res: Response) => {
  const search = (req.query.search as string) || "";
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 5);
  const searchRegExp = new RegExp(search, "i");

  const filter = {
    $or: [
      { name: { $regex: searchRegExp } },
      { email: { $regex: searchRegExp } },
      { phone: { $regex: searchRegExp } },
    ],
  };

  const options = {
    password: 0,
    __v: 0,
  };

  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    User.find(filter, options).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  if (users.length === 0) {
    return res
      .status(404)
      .json({ message: "条件に一致するユーザーが見つかりません" });
  }

  const totalPages = Math.ceil(totalCount / limit);
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return res.status(200).json({
    message: "Success",
    users,
    pagination: {
      currentPage: page,
      previousPage: previousPage,
      nextPage: nextPage,
      totalPages: totalPages,
      totalUsers: totalCount,
      usersPerPage: limit,
    },
  });
});

export const singleUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("認証されていません", 401));
    }

    return res.status(200).json({
      success: true,
      user,
    });
  }
);

export const deleteUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return next(new ErrorHandler("認証されてません", 401));
    }
    await user?.deleteOne();
    return res.status(200).json({
      success: true,
      message: "ユーザーの削除に成功しました",
    });
  }
);

export const upDateUser = TryCatch(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { isBanned, role } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }
    if (isBanned !== undefined) {
      user.isBanned = isBanned;
    }
    if (role) {
      user.role = role;
    }
    await User.findOneAndUpdate({ _id: userId }, user);
    const updateUser = await User.findById(userId);
    if (!updateUser) {
      return res
        .status(500)
        .json({ error: "ユーザー情報の更新に失敗しました" });
    }
    res.json({ user: updateUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "サーバーエラー" });
  }
});
