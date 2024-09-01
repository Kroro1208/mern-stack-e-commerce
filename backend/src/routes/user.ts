import express from "express";
import { register } from "../controller/user";

export const userRoutes = express.Router();
userRoutes.post("/register", register);
