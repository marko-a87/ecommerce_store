import mongoose from "mongoose";

import { availableSize } from "../util/availableSize.js";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  size: {
    type: String,
    required: true,
    validate: [availableSize, "Size is not available"],
    lowercase: true,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
