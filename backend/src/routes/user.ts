import express from "express";
import { deleteUser, getAllUsers, login, register, singleUser, upDateUser } from "../controller/user";
import { isAdmin, requireSignIn } from "../middleware/auth";

export const userRoutes = express.Router();
userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/all", requireSignIn, isAdmin, getAllUsers);
userRoutes.get("/:id", requireSignIn, isAdmin, singleUser);
userRoutes.delete("/:id", requireSignIn, isAdmin, deleteUser);
userRoutes.put("/:id", requireSignIn, isAdmin, upDateUser)
