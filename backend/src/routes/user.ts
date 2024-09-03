import express from "express";
import { getAllUsers, login, register } from "../controller/user";
import { isAdmin, requireSignIN } from "../middleware/auth";

export const userRoutes = express.Router();
userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/test-all", getAllUsers);
userRoutes.get("/all", requireSignIN, isAdmin, getAllUsers);
