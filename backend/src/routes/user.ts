import express from "express";
import { getAllUsers, login, register } from "../controller/user";

export const userRoutes = express.Router();
userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/all", getAllUsers);
