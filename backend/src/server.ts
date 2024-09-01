import express from "express";
import dotenv from "dotenv";
import mongoUri from "./config/connectDB";
import mongoose from "mongoose";

dotenv.config();
const app = express();

const mongoConnectUri = mongoUri();

mongoose
  .connect(mongoConnectUri)
  .then(() => console.log("DBに接続できました"))
  .catch((err) => {
    console.error("DBエラーが発生しました", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});

app.get("/server-health", (req, res) => {
  res.json({ status: "OK", message: "Server health is fine" });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
