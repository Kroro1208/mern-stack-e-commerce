import express from "express";
import { isAdmin, requireSignIn } from "../middleware/auth";
export const productRoutes = express.Router();

// productRoutes.post("/new", requireSignIn, isAdmin, singleUpload, newProduct);
productRoutes.get("all");
// productRoutes.get("/latest", getLatestProducts);
// productRoutes.get("/categories", getAllCategories);
// productRoutes.get("/all-products", getAllProducts);
