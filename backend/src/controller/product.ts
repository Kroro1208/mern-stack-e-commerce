import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "名前は必須です"],
    },
    photo: {
      type: String,
      required: [true, "画像は必須です"],
    },
    price: {
      type: Number,
      required: [true, "価格は必須です"],
    },
    stock: {
      type: Number,
      required: [true, "在庫数は必須です"],
    },
    category: {
      type: String,
      required: [true, "カテゴリーは必須です"],
      trim: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", schema);
