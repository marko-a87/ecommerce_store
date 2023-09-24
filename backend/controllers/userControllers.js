import User from "../models/user.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";
import { generateToken } from "../util/generateToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { name, password, email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    password,
    email,
  });

  if (user) {
    return res.status(201).json({
      message: "User created",
      user_profile: { name, password, email },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let token;

  //jwt web token
  token = req.cookies.jwt;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    if (token) {
      throw new Error("User already logged in");
    }
    generateToken(res, user._id, process.env.TOKEN_SECRET);
    res.status(200).json({
      message: "User logged in",

      //Products: Shows listings for products on account
    });
  } else {
    res.status(400);
    throw new Error("Email or password is invalid");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  let token;

  //jwt web token
  token = req.cookies.jwt;

  //Takes jwt as a tag and sets the cookie to 0 so the user can logout
  if (token) {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({
      message: "User logged out",
    });
    console.log("User logged out");
  } else {
    res.status(400);

    throw new Error("No user logged in");
  }
});

//Show product options with item, stock and size options
//client has the choice to pick 1 and the one chosen will be sent by email.
const getUserProducts = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const products = await Product.find();
    if (products) {
      return res.status(200).json({
        product_listing: {
          _id: products._id,
          name: products.name,
          quantity: products.quantity,
          price: products.price,
        },
      });
    } else {
      res.status(404);
      throw new Error("No products found");
    }
  }
  next();
});

//Method selects a product from the options listed and sends a confirmation email that the product has been ordered to the user

export { createUser, loginUser, getUserProducts, logoutUser };
