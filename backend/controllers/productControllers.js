import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../util/sendEmail.js";
const createProduct = asyncHandler(async (req, res) => {
  const { name, quantity, price, size } = req.body;

  const product = await Product.create({
    name,
    quantity,
    price,
    size,
  });

  if (product) {
    res.status(201).json({
      message: "Product created",
      product_info: {
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        size: product.size,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid product information");
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  if (products) {
    res.status(200).json({
      product_listing: products,
    });
  } else {
    res.status(404);
    throw new Error("No products found");
  }
});

const selectProduct = asyncHandler(async (req, res, next) => {
  const { _id, name, quantity } = req.body;
  const product_select = await Product.findById({ _id });

  /*/if(req.body.quantity > product_select.quantity)
  {
    p
  }


*/
  if (product_select && name == product_select.name) {
    if (quantity > product_select.quantity) {
      throw new Error("You have exceeded current stock");
    }
    product_select.quantity = product_select.quantity - quantity;
    const update_product_select = await product_select.save();
    sendEmail(req.user.email, product_select, quantity);

    return res.status(200).json({
      message: " You have purchased an item",
      product_ordered: {
        name: update_product_select.name,
        quantity: update_product_select.quantity,
        price: update_product_select.price,
        size: update_product_select.size,
      },
    });
  }

  next();
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.body;

  const productSelect = await Product.findByIdAndDelete({ _id });

  if (productSelect) {
    res.status(200).json({
      message: "Product deleted",
    });
  } else {
    res.status(404);
    throw new Error("No product found");
  }
});
const updateStock = asyncHandler(async (req, res, next) => {
  const { _id, quantity } = req.body;

  const findProduct = await Product.findByIdAndUpdate({ _id });

  if (findProduct) {
    findProduct.quantity = findProduct.quantity + quantity;
    findProduct.save();
    res.status(200).json({
      message: `stock has been successfully updated for ${findProduct.name}`,
    });
  }
  next();
});
export {
  createProduct,
  getAllProducts,
  selectProduct,
  updateStock,
  deleteProduct,
};
