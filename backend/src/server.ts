import express from "express";
import dotenv from "dotenv";
import mongoUri from "./config/connectDB";
import mongoose from "mongoose";
import { userRoutes } from "./routes/user";
import ErrorHandler from "./utils/utility-class";
import { productRoutes } from "./routes/product";

dotenv.config();
const app = express();
app.use(express.json());
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

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use(
  (
    err: ErrorHandler,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
