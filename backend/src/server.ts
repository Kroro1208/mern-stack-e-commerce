import express from "express";
import dotenv from "dotenv";
import mongoUri from "./config/connectDB";
import mongoose from "mongoose";
import morgan from "morgan";

dotenv.config();
const app = express();

const mongoConnectUri = mongoUri();

const connectDB = async () => {
  try {
    await mongoose.connect(mongoConnectUri);
    console.log("DBに接続できました");
  } catch (error) {
    console.error("DBエラーが発生しました", error);
    process.exit(1);
  }
};

connectDB().catch((err) => {
  console.error("初期データベース接続に失敗しました:", err);
  process.exit(1);
});

app.use(morgan("dev"));
app.use(express.json());

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});