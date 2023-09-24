import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/userControllers.js";
import {
  getAllProducts,
  selectProduct,
} from "../controllers/productControllers.js";
import { protectUser } from "../middleware/userMiddleware.js";
const router = express.Router();

//Create a new user
router.post("/create", createUser);

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/products", protectUser, getAllProducts);
router.post("/select/product", protectUser, selectProduct);
//Delete user account
router.delete("/delete", (req, res) => {
  res.send("User deleted");
});
//update user account
// GET all product listings
// POST choose a product listing
// GET product listing associated with user
// Delete product listing for user

export default router;
