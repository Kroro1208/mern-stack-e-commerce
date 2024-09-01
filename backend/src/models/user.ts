import mongoose from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  photo: string;
  role: "user" | "admin";
  address: string;
  createdAt: Date;
  updatedAt: Date;
  isBanned: boolean;
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "名前を入力は必須です"],
    },
    email: {
      type: String,
      required: [true, "メールアドレスの入力は必須です"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "電話番号の入力は必須です"],
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    address: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", schema);
