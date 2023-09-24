//Delete a user
//Delete a product
//Create a user
//Update a user
//GET all users
//GET all products

import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateStock,
} from "../controllers/productControllers.js";
import {
  createAdmin,
  findAllUsers,
  findUser,
  loginAdmin,
  logoutAdmin,
  deleteUser,
} from "../controllers/adminControllers.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";
const router = express.Router();

router.post("/create/product", protectAdmin, createProduct);
router.get("/find/products", protectAdmin, getAllProducts);
router.get("/find/users", protectAdmin, findAllUsers);
router.get("/user", findUser);
router.post("/register", createAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.delete("/user/delete", protectAdmin, deleteUser);
router.post("/update/stock", protectAdmin, updateStock);
router.delete("/delete/product", protectAdmin, deleteProduct);

//Delete user method
//Update product method
//Product is unavailable
export default router;
